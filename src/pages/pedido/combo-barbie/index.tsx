import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  IPizzaSabor,
  IPizzaGrupo,
  IPizzaSaborValor,
  IPizzaTamanho,
} from "@models/pizza";
import { IItem, IPizza } from "@models/item";
import { formatCurrency, getValueString } from "@util/format";
import { Sabor } from "@components/cardapio/sabor";
import { SaboresStyle } from "@styles/pages/pedido/pizza/sabores/styles";
import { useMyOrder } from "@context/myOrderContext";
import { ButtonSecondary, FloatButton } from "@styles/components/buttons";
import { v4 as uuidv4 } from "uuid";
import Loading from "@components/loading";
import { env } from "@config/env";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import { toast } from "react-toastify";
import { IOutro } from "@models/outro";

const tamanhoId = "4d29fd7f-2635-474a-a2ec-2cd8560244d5";

const Sabores: NextPage = () => {
  const router = useRouter();
  const [checkedList, setCheckedList] = useState<IPizzaSabor[]>([]);
  const { addItem } = useMyOrder();
  const [size, setSize] = useState<IPizzaTamanho | null>(null);
  const [groups, setGroups] = useState<Array<IPizzaGrupo[]>>([]);
  const [nextInactive, setNextInactive] = useState<boolean>(false);

  const [itensEscolhidos, setItensEscolhidos] = useState<IPizza[]>([]);

  const addItemPromo = (item: IPizza | IPizza[]) => {
    const itens = Array.isArray(item) ? item : [item];
    setItensEscolhidos((prev) => [
      ...prev,
      ...itens.map((x) => ({
        ...x,
        observacao: [x.observacao, "COMBO DA BARBIE"].filter(Boolean).join(" "),
      })),
    ]);
  };
  useEffect(() => {
    if (itensEscolhidos.length > 0) {
      const novaPizza: IPizza = {
        tipo: "pizza",
        valor: 9.99,
        sabores: [
          {
            id: "2428yae5-025c-4a84-9d9a-4276f18hc8da",
            nome: "Barbie 💞",
            disponivel: true,
            ingredientes: ["Mussarela", "Chocolate", "Granulado"],
            valores: [
              {
                tamanhoId: "789182b6-4b12-41e6-929b-49a33122b7a2",
                valor: 23,
              },
              {
                tamanhoId: "fd8a7371-7ee5-45ba-8157-488093618799",
                valor: 34,
              },
              {
                tamanhoId: "4d29fd7f-2635-474a-a2ec-2cd8560244d5",
                valor: 43,
              },
              {
                tamanhoId: "5c82b567-cd53-453b-82c8-4f9b911db48b",
                valor: 50,
              },
            ],
            grupoId: "c0750d21-a966-4d53-b312-5acdfbc649fa",
          },
        ],
        tamanho: {
          id: "789182b6-4b12-41e6-929b-49a33122b7a2",
          nome: "PEQUENA",
          fatias: 4,
          tamanhoAprox: 25,
          valorMin: 0,
          visivel: true,
          ativado: true,
          maxSabores: 1,
        },
        id: uuidv4(),
      };

      const novaBebida: IOutro = {
        id: "468a1c21-98da-438b-a915-7eb925ff3187",
        nome: "COCA COLA 1l",
        disponivel: true,
        imagemUrl: "https://i.ibb.co/XpRF5ry/FRENTE.jpg",
        valor: 7,
        observacao: "",
        vendidos: 50,
        visivel: true,
        tipo: "bebida",
      };

      addItem([itensEscolhidos[0], novaPizza, novaBebida]);
      router.push("/pedido/itens");
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

  useEffect(() => {
    router.push("/pedido");
  }, []);

  const getGroups = (g: IPizzaGrupo) => (
    <div className="group" key={g.nome}>
      <h2 className="group-name">{g.nome}</h2>
      <div className="group-flavours">
        {g.sabores.map((s) => (
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
            }}
          />
        ))}
      </div>
    </div>
  );
  const getSaborValor = (s) => {
    return 33;
  };

  const getValorFormatted = (v: number) =>
    formatCurrency(v / checkedList.length);

  const next = () => {
    try {
      setNextInactive(true);
      const novaPizza: IPizza = {
        tipo: "pizza",
        valor: 33,
        sabores: checkedList,
        tamanho: size,
        id: uuidv4(),
      };

      addItemPromo(novaPizza);
    } catch (e) {
      console.error((e as Error).message, (e as Error).stack);
      setNextInactive(false);
    }
  };
  return (
    <SaboresStyle>
      <div className="title">
        <h5 className="title">Pizza G + Pizza P (Doce) + Coca 1L:</h5>

        <h3 className="title">R$ 49,99</h3>
      </div>
      {groups.length && size ? (
        <>
          <TextContainer title="SABORES" subtitle={size && `SELECIONE ATÉ 2`} />
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
            onClick={next}
          >
            <p>Pronto! {">>"}</p>
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
    </SaboresStyle>
  );
};

export default Sabores;
