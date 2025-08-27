import { env } from "@config/env";
import { IItemPedido, IPedido } from "tpdb-lib";
import { IPizzaExtra } from "tpdb-lib";
import axios from "axios";
import Image from "next/image";
import { CgTrash } from "react-icons/cg";
import { toast } from "react-toastify";
import { ItemStyle } from "./styles";
import { colors } from "@styles/colors";
import { formatCurrency } from "@util/format";

export const Item = ({
  item,
  pedido,
  excluirItem,
}: {
  item: IItemPedido;
  pedido: IPedido;
  excluirItem?: (itemsIds: string[]) => void;
}) => {
  return (
    <ItemStyle key={item.id} className="item">
      <aside className="imagem">
        <Image
          src={
            item.tipo === "pizza"
              ? item.tamanho.imagemUrl
              : item.tipo === "bebida"
              ? item.bebidaOriginal.imagemUrl
              : item.lancheOriginal.imagemUrl
          }
          layout="fill"
          objectFit={item.tipo === "bebida" ? "scale-down" : "cover"}
        />
      </aside>
      <aside className="info">
        {item.tipo === "pizza" ? (
          <>
            <h3 className="nome">Pizza {item.tamanho.nome}</h3>
            <p className="descricao">
              {item.sabores.map((x) => x.nome).join(", ")}
            </p>
            <p className="subdescricao">
              {[
                !item.borda.padrao ? item.borda.nome : "",
                !item.espessura.padrao ? item.espessura.nome : "",
                !item.ponto.padrao ? item.ponto.nome : "",
                (() => {
                  const extrasAgrupados: (IPizzaExtra & {
                    qtd: number;
                  })[] = [];
                  item.extras.forEach((extra) => {
                    const i = extrasAgrupados.findIndex(
                      (x) => x.id === extra.id
                    );

                    if (i > -1) {
                      extrasAgrupados[i].qtd += 1;
                    } else {
                      extrasAgrupados.push({ ...extra, qtd: 1 });
                    }
                  });
                  return extrasAgrupados
                    .map((x) => `x${x.qtd} ${x.nome}`)
                    .join(", ");
                })(),
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </>
        ) : item.tipo === "bebida" ? (
          <>
            <h3 className="nome">{item.bebidaOriginal.nome}</h3>
            <p className="descricao">{item.bebidaOriginal.descricao}</p>
          </>
        ) : (
          <>
            <h3 className="nome">{item.lancheOriginal.nome}</h3>
            <p className="descricao">{item.lancheOriginal.descricao}</p>
          </>
        )}
      </aside>

      <aside>
        <h6 className="item-price">
          <span
            className="price"
            style={{
              color:
                item.desconto || !item.valor ? colors.checkedLight : undefined,
            }}
          >
            <span>
              {formatCurrency(
                (item.valor ?? 0) - (item.desconto ?? 0) ||
                  ("GRÁTIS!" as unknown as number)
              )}
            </span>
          </span>
          {!!item.desconto && (
            <span
              className="original-price"
              style={{ textDecoration: "line-through" }}
            >
              {formatCurrency(item.valor)}
            </span>
          )}
        </h6>
      </aside>

      {!!excluirItem && (
        <button
          className="excluir"
          onClick={async () => {
            try {
              const resp = await window.confirm(
                "Se esse produto fizer parte de um combo, o combo inteiro será excluído! Deseja realmente excluir?"
              );
              if (resp) {
                let itemsIds = pedido.itens
                  .filter((x) => !!x.grupoId && x.grupoId === item.grupoId)
                  .map((x) => x.id);
                if (!itemsIds.length) itemsIds = [item.id];
                await axios.delete(`${env.apiURL}/pedidos/itens`, {
                  params: {
                    pedidoId: pedido.id,
                    itemsIds,
                  },
                });
                excluirItem(itemsIds);
              }
            } catch (err) {
              toast.error(
                "Oops, não foi possível excluir este item. Informe o erro à pizzaria"
              );
            }
          }}
        >
          <CgTrash />
        </button>
      )}
    </ItemStyle>
  );
};
