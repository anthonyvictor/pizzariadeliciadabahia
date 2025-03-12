import { GetServerSideProps, NextPage } from "next";
import React, { createRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  IPizzaSabor,
  IPizzaGrupo,
  IPizzaSaborValor,
  IPizzaTamanho,
} from "@models/pizza";
import { IItem, IPizza } from "@models/item";
import { formatCurrency, getValueString, removeAccents } from "@util/format";
import { Sabor } from "@components/cardapio/sabor";
import { SaboresStyle } from "@styles/pages/pedido/pizza/sabores/styles";
import { useMyOrder } from "@context/myOrderContext";
import {
  ButtonPrimary,
  ButtonSecondary,
  FloatButton,
} from "@styles/components/buttons";
import { v4 as uuidv4 } from "uuid";
import Loading from "@components/loading";
import { env } from "@config/env";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import Modal from "@components/modal";
import { toast } from "react-toastify";
import { usePromo } from "@context/promoContext";
import { IOutro } from "@models/outro";
import { Searchbar } from "@styles/components/Searchbar";
import BebidaModal from "@components/bebidaModal";

const Sabores: NextPage<{ tamanhoId: string }> = ({ tamanhoId }) => {
  const router = useRouter();
  const [checkedList, setCheckedList] = useState<IPizzaSabor[]>([]);
  const { addItem } = useMyOrder();
  const [size, setSize] = useState<IPizzaTamanho | null>(null);
  const [groups, setGroups] = useState<Array<IPizzaGrupo[]>>([]);
  const [nextInactive, setNextInactive] = useState<boolean>(false);
  const { getBordaGratis, getGFRefri } = usePromo();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalBebida, setShowModalBebida] = useState<boolean>(false);

  const [observacao, setObservacao] = useState<string>("");

  const [borda, setBorda] = useState<String | null>();

  const loadAll = async () => {
    try {
      const sizesFromBackend = (await (
        await fetch(`${env.apiURL}/pizzas/tamanhos?id=${tamanhoId}`, {
          headers: { "Content-Type": "application/json" },
        })
      ).json()) as IPizzaTamanho[];

      if (!sizesFromBackend[0]) throw new Error("Tamanho inválido");
      setSize(sizesFromBackend[0]);

      const groupsFromBackend = (await (
        await fetch(`${env.apiURL}/pizzas/sabores`, {
          headers: { "Content-Type": "application/json" },
        })
      ).json()) as IPizzaGrupo[];

      const groupsLeft: IPizzaGrupo[] = [];
      const groupsRight: IPizzaGrupo[] = [];

      groupsFromBackend.forEach((g) => {
        groupsFromBackend.indexOf(g) % 2 === 0
          ? groupsLeft.push(g)
          : groupsRight.push(g);
      });

      setGroups([groupsLeft, groupsRight]);
    } catch (e) {
      console.error((e as Error).message, (e as Error).stack);
      router.back();
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const getAllValues = (valores: IPizzaSaborValor[]) => {
    return (
      size &&
      getValueString({
        name: size.nome,
        value: valores.find((x) => x.tamanhoId === size.id).valor,
      })
    );
  };

  const [search, setSearch] = useState<string>("");
  const inputRef = createRef<HTMLInputElement>();
  const [userClicked, setUserClicked] = useState(false);

  const getGroups = (g: IPizzaGrupo) => {
    const sabores = g.sabores.filter((x) =>
      search.length
        ? removeAccents(`${x.nome} ${x.ingredientes.join(" ")}`)
            .toLowerCase()
            .includes(removeAccents(search).toLowerCase())
        : true
    );
    return !sabores.length ? (
      <></>
    ) : (
      <div className="group" key={g.nome}>
        <h2 className="group-name">{g.nome}</h2>
        <div className="group-flavours">
          {sabores.map((s) => (
            <Sabor
              key={s.id}
              nome={s.nome}
              ingredientes={s.ingredientes}
              valuesString={getAllValues(s.valores)}
              showCheckBox={true}
              active={s.disponivel}
              checked={!!checkedList.find((x) => x.nome === s.nome)}
              setChecked={(value) => {
                value
                  ? size.maxSabores > checkedList.length &&
                    setCheckedList((prev) => [...prev, s])
                  : setCheckedList((prev) => {
                      return prev.filter((x) => x.nome !== s.nome);
                    });

                if (userClicked) {
                  setSearch("");
                  inputRef?.current?.focus();
                }
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  const getSaborValor = (s) => {
    const value = s.valores.find((v) => v.tamanhoId === size.id).valor;
    return value;
  };

  const getValorFormatted = (v: number) =>
    formatCurrency(
      Math.ceil(Number(Number(v / checkedList.length).toFixed(1)))
    );

  enum Erros {
    saborBorda = "Selecione o sabor da borda!",
  }

  const next = (bebida?: IOutro | undefined) => {
    try {
      setNextInactive(true);
      if (getBordaGratis(size) && borda === undefined)
        throw new Error(Erros.saborBorda);
      const midValue = Math.ceil(
        Number(
          Number(
            checkedList.reduce((max, curr) => getSaborValor(curr) + max, 0) /
              checkedList.length
          ).toFixed(1)
        )
      );
      const novaPizza: IPizza = {
        tipo: "PIZZA",
        valor: midValue,
        sabores: checkedList,
        tamanho: size,
        observacao: [
          (observacao ?? "").trim(),
          borda ? `BORDA DE ${borda}` : "",
        ]
          .filter(Boolean)
          .join(", "),
        id: uuidv4(),
      };

      const bordaAtv = getBordaGratis(size);

      console.log("BORDA ATV", getGFRefri(size));
      // && getBordaGratis(size)
      if (getGFRefri(size)) {
        const comboId = uuidv4();
        const novaBebida = bebida
          ? {
              ...bebida,
              comboId,
            }
          : undefined;

        // const novaBebida: IOutro = {
        //   id: "672a99e5ae893a18026b6052",
        //   nome: "COCA COLA 600ml",
        //   disponivel: false,
        //   imagemUrl:
        //     "https://tucunarenachapa.com.br/wp-content/uploads/2022/11/coc-600ml.png",
        //   valor: 5,
        //   observacao: "",
        //   tipo: "BEBIDA",
        //   vendidos: 10,
        //   visivel: false,
        //   comboId,
        // };
        const itens: IItem[] = [
          {
            ...novaPizza,
            valor: novaPizza.valor - (novaBebida?.valor ?? 0),
            comboId,
          },
        ];
        if (novaBebida) itens.push(novaBebida);
        addItem(itens);
        // addItem([
        //   // { ...novaPizza, valor: novaPizza.valor, comboId },
        //   { ...novaPizza, valor: (novaPizza.valor - (novaBebida?.valor ?? 0)), comboId },
        //   novaBebida,
        // ]);
      } else {
        addItem(novaPizza);
      }
      router.push("/pedido");
    } catch (e) {
      switch ((e as Error).message) {
        case Erros.saborBorda:
          toast.error(e.message);
          break;

        default:
          break;
      }

      console.error((e as Error).message, (e as Error).stack);
      setNextInactive(false);
    }
  };
  return (
    <SaboresStyle>
      {groups.length && size ? (
        <>
          <TextContainer
            title="SABORES"
            subtitle={size && `SELECIONE ATÉ ${size.maxSabores}`}
          />
          <Searchbar
            value={search}
            setValue={setSearch}
            placeholder="Procure por um sabor ou ingrediente..."
            ref={inputRef}
            userClicked={userClicked}
            setUserClicked={setUserClicked}
          />
          <div className="groups">
            <aside className="groups-left">
              {groups[0].map((g) => getGroups(g))}
            </aside>
            <aside className="groups-right">
              {groups[1].map((g) => getGroups(g))}
            </aside>
          </div>
          <BottomControls backButton notFixed />
          <div className="bottom-info">
            <h3 className="selected-flavours">
              <b>Selecionados: </b>
              {checkedList
                .map((s) => s.nome.split(" ").slice(0, -1).join(" "))
                .join(", ")}
            </h3>
          </div>
          <FloatButton
            className={`${checkedList.length === 0 ? "hidden" : undefined}`}
            disabled={nextInactive}
            onClick={() => setShowModal(true)}
          >
            <p>Continuar {">>"}</p>
            <b>
              {getValorFormatted(
                checkedList.reduce((max, curr) => getSaborValor(curr) + max, 0)
              )}
            </b>
          </FloatButton>
        </>
      ) : (
        <Loading />
      )}

      {showModal && (
        <Modal
          className="observacoes-modal"
          label="Alguma observação?"
          description={`Por ex: "Sem cebola", ou "Bem assada"...`}
          type={"custom"}
          buttons={
            <>
              <ButtonSecondary onClick={() => setShowModal(false)}>
                Voltar
              </ButtonSecondary>
              <ButtonPrimary
                disabled={nextInactive}
                onClick={() => {
                  if (getGFRefri(size)) {
                    setShowModalBebida(true);
                  } else {
                    next();
                  }
                }}
              >
                Continuar!
              </ButtonPrimary>
            </>
          }
        >
          <input
            type="text"
            placeholder="Ex: Pouco orégano..."
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                next();
              }
            }}
          />

          {getBordaGratis(size) && (
            <div className="borda-gratis">
              <h3 className="borda-gratis-title">Borda recheada grátis!</h3>
              <p className="borda-gratis-subtitle">
                Selecione o sabor da borda:
              </p>
              <ul className="borda-gratis-list">
                {[
                  { name: "noborder", label: "Sem borda", value: null },
                  {
                    name: "border1",
                    label: "Requeijão",
                    value: "REQUEIJÃO",
                  },
                  {
                    name: "border2",
                    label: "Cheddar",
                    value: "CHEDDAR",
                  },
                ].map((x) => (
                  <li
                    className={`borda-gratis-item ${
                      borda === x.value ? "checked" : ""
                    }`}
                    key={x.label}
                    onClick={() => setBorda(x.value)}
                  >
                    {x.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      )}

      {showModalBebida && <BebidaModal next={next} />}
    </SaboresStyle>
  );
};

export default Sabores;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      tamanhoId: ctx.query["tamanho"],
    },
  };
};
