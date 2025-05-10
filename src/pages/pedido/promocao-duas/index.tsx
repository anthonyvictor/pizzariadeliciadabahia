import { GetServerSideProps, NextPage } from "next";
import { createRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  IPizzaSabor,
  IPizzaGrupo,
  IPizzaSaborValor,
  IPizzaTamanho,
} from "@models/pizza";
import { formatCurrency, getValueString, removeAccents } from "@util/format";
import { IItem, IPizza } from "@models/item";
import { IOutro } from "@models/outro";
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
import { toast } from "react-toastify";
import Modal from "@components/modal";
import { usePromo } from "@context/promoContext";
import { Searchbar } from "@styles/components/Searchbar";

const Sabores: NextPage = () => {
  const router = useRouter();
  const [checkedList, setCheckedList] = useState<IPizzaSabor[]>([]);
  const { addItem } = useMyOrder();
  const [size, setSize] = useState<IPizzaTamanho | null>(null);
  const [groups, setGroups] = useState<Array<IPizzaGrupo[]>>([]);
  const [nextInactive, setNextInactive] = useState<boolean>(false);
  const { getDuasRefri60, promosCarregadas } = usePromo();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalTuto, setShowModalTuto] = useState<boolean>(true);

  const [observacao, setObservacao] = useState<string>("");
  const [comboId] = useState<string>(uuidv4());

  const [itensEscolhidos, setItensEscolhidos] = useState<IPizza[]>([]);
  const comCoca = false; //getDuasRefri60();
  const comGoob = comCoca ? false : false; //getDuasRefri60();

  const tamanhoId = "656a0b4781f555282573eb4a";
  const valorSaborFixo = comCoca ? 26.5 : comGoob ? 29 : 29; //27.5;
  const valorPromo = 54.99;

  const [search, setSearch] = useState<string>("");
  const inputRef = createRef<HTMLInputElement>();
  const [userClicked, setUserClicked] = useState(false);

  useEffect(() => {
    if (promosCarregadas) {
      if (!getDuasRefri60()) {
        router.push("/pedido");
      }
    }
  }, [promosCarregadas]);

  const addItemPromo = (item: IPizza | IPizza[]) => {
    const itens = Array.isArray(item) ? item : [item];

    setItensEscolhidos((prev) => [
      ...prev,
      ...itens.map((x) => ({
        ...x,
        observacao: [x.observacao, "PROMOCIONAL"].filter(Boolean).join(" "),
        comboId,
      })),
    ]);
  };
  useEffect(() => {
    if (itensEscolhidos.length === 1) {
      toast("Pizza adicionada! Agora adicione a segunda pizza.", {
        type: "success",
      });

      setCheckedList([]);
      setNextInactive(false);
      setShowModalTuto(true);
    } else if (itensEscolhidos.length === 2) {
      const novaBebida: IOutro | undefined = comCoca
        ? {
            id: "656a212781f555282589ba9b",
            nome: "refrigerante COCA COLA 1l",
            disponivel: true,
            imagemUrl: "https://i.ibb.co/XpRF5ry/FRENTE.jpg",
            valor: 7,
            observacao: "",
            comboId,
            vendidos: 50,
            visivel: true,
            tipo: "bebida",
          }
        : comGoob
        ? {
            id: "66072dae306179b1c780659a",
            nome: "refrigerante Goob Guaraná 1L",
            valor: 5,
            disponivel: true,
            imagemUrl: "https://i.ibb.co/S53JdwH/ylhq3wwi.png",
            comboId,
            observacao: "",
            tipo: "bebida",
            vendidos: 200,
            visivel: true,
          }
        : undefined;

      const itensFinais: IItem[] = [...itensEscolhidos];

      if (comCoca || comGoob) itensFinais.push(novaBebida);

      addItem(itensFinais);
      router.push("/pedido");
    }
  }, [itensEscolhidos]);

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
        await fetch(`${env.apiURL}/pizzas/sabores?promocionais=true`, {
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
              showCheckBox={true}
              active={s.disponivel}
              checked={!!checkedList.find((x) => x.nome === s.nome)}
              setChecked={(value) => {
                value
                  ? 2 > checkedList.length &&
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
    return valorSaborFixo;
  };

  const getValorFormatted = (v: number) =>
    formatCurrency(v / checkedList.length);

  const next = () => {
    try {
      setNextInactive(true);
      setShowModal(false);
      const midValue =
        checkedList.reduce((max, curr) => getSaborValor(curr) + max, 0) /
        checkedList.length;
      const novaPizza: IPizza = {
        tipo: "pizza",
        valor: valorSaborFixo,
        sabores: checkedList,
        tamanho: size,
        id: uuidv4(),
        observacao,
      };

      addItemPromo(novaPizza);
    } catch (e) {
      console.error((e as Error).message, (e as Error).stack);
      setNextInactive(false);
    }
  };

  if (!promosCarregadas) return <></>;

  return (
    <SaboresStyle>
      <p className="title">
        {comCoca || comGoob ? (
          <>
            <h5 className="title">2 pizzas G + 1 Refri 1L por:</h5>
            <h1>R$ 59,99</h1>
          </>
        ) : (
          <>
            <h5 className="title">2 pizzas {"GRANDES"} por:</h5>
            <h1>{formatCurrency(valorPromo)}</h1>
          </>
        )}
        <h5 className="title">(Pagamento em Espécie ou PIX)</h5>
      </p>

      {groups.length && size ? (
        <>
          <TextContainer title="SABORES" subtitle={size && `SELECIONE ATÉ 2`} />
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
            <p>Conitinuar {">>"}</p>
            {/* <b>
              {getValorFormatted(
                checkedList.reduce((max, curr) => getSaborValor(curr) + max, 0)
              )}
            </b> */}
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
                  next();
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
        </Modal>
      )}

      {showModalTuto && (
        <Modal
          className="tuto-modal"
          label={
            itensEscolhidos.length === 0 ? `PRIMEIRA pizza` : "SEGUNDA pizza"
          }
          description={`Selecione até 2 sabores e depois, clique em "Continuar!"`}
          type={"custom"}
          buttons={
            <>
              <ButtonPrimary
                onClick={() => {
                  setShowModalTuto(false);
                }}
              >
                Ok
              </ButtonPrimary>
            </>
          }
        />
      )}
    </SaboresStyle>
  );
};

export default Sabores;
