import { useEffect, useState } from "react";
import { ItensStyle } from "src/views/pedido/itens/styles";
import { useRouter } from "next/router";
import BottomControls from "@components/pedido/bottomControls";
import Modal from "@components/modal";
import { ButtonSecondary } from "@styles/components/buttons";
import axios from "axios";
import { env } from "@config/env";
import TextContainer from "@components/textContainer";
import { Item } from "./item";
import { usePedidoStore } from "src/infra/zustand/pedido";

export const ItensView = () => {
  const router = useRouter();
  const { pedido } = usePedidoStore();
  const [showModalRemoverItem, setShowModalRemoverItem] = useState<{
    show: boolean;
    id?: string;
  }>({ show: false });

  const [itens, setItens] = useState(pedido.itens);

  useEffect(() => {
    if (!itens.length) router.push("/pedido");
  }, [itens]);

  // const pizzasAgrupadas = agrupar(
  //   itens.filter((x) => x.tipo === "pizza"),
  //   ["tamanho.id", "grupoId"]
  // );
  // const bebidasAgrupadas = agrupar(
  //   itens.filter((x) => x.tipo === "bebida"),
  //   ["bebidaOriginal.id", "grupoId"]
  // );

  return (
    <ItensStyle>
      <TextContainer
        title="Meus itens"
        description="Produtos adicionados no seu pedido"
      />

      <ul className="itens no-scroll">
        {itens.map((item, i) => {
          return (
            <Item
              key={item.id}
              numero={i + 1}
              item={item}
              excluirItem={(itemsIds) => {
                setItens((prev) =>
                  prev.filter((x) => !itemsIds.includes(x.id))
                );
              }}
            />
          );
        })}
      </ul>
      {/* <div className="menu">
        <ul>
          {(pedido?.itens ?? []).map((item) => (
            <li key={item.id}>
              {item.hasOwnProperty("sabores") ? (
                <div className="left">
                  <div className="subdiv">
                    <div className="subleft">
                      <img
                        src={"/images/pedido-pizza.svg"}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="subright">
                      <h3 className="item-title">
                        Pizza {(item as IPizzaPedido).tamanho.nome}
                      </h3>
                      <h5 className="item-subtitle">
                        Sabores:{" "}
                        {(item as IPizzaPedido).sabores
                          .map((s) => s.nome.split(" ").slice(0, -1).join(" "))
                          .join(", ")}
                      </h5>
                      {item?.observacoes.replace("PROMOCIONAL", "").trim() && (
                        <p className="item-obs">{item.observacoes}</p>
                      )}
                      <h5 className="item-info">
                        Preço: {formatCurrency(item.valor)}
                      </h5>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="left">
                  <div className="subdiv">
                    <span className="subleft">
                      <img
                        src={(item as IOutro).imagemUrl}
                        width={40}
                        height={40}
                      />
                    </span>
                    <span className="subright">
                      <h3 className="item-title">
                        {(item as IOutro)?.nome.toUpperCase()}
                      </h3>
                      <h5 className="item-info">
                        Preço: {formatCurrency(item.valor)}
                      </h5>
                    </span>
                  </div>
                </div>
              )}
              <div className="right">
                <button
                  title="Remover item"
                  onClick={() => {
                    setShowModalRemoverItem({ show: true, id: item.id });
                  }}
                >
                  x
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
      <BottomControls backButton />
      {showModalRemoverItem.show && (
        <Modal
          label="Excluir item?"
          description="Se ele for parte de um combo, isso irá excluir o combo completo."
          type={"custom"}
          buttons={
            <>
              <ButtonSecondary
                onClick={() => {
                  setShowModalRemoverItem({ show: false });
                }}
              >
                Voltar
              </ButtonSecondary>

              <ButtonSecondary
                onClick={async () => {
                  await axios.delete(`${env.apiURL}pedidos/itens`, {
                    data: {
                      pedidoId: pedido.id,
                      itemId: showModalRemoverItem.id,
                    },
                  });
                  setShowModalRemoverItem({ show: false });
                }}
              >
                Remover
              </ButtonSecondary>
            </>
          }
        />
      )}
    </ItensStyle>
  );
};
