import TextContainer from "@components/textContainer";
import { ConfirmacaoViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { IPedido } from "tpdb-lib";
import { Item } from "../itens/item";
import { Endereco } from "./endereco";
import { obterValoresDoPedido } from "@util/pedidos";
import { colors } from "@styles/colors";
import { formatCurrency } from "@util/format";
import { useRouter } from "next/router";
interface IInfo {
  titulo: string;
  valor: number;
  bold?: boolean;
  negativo?: boolean;
  cor?: string;
}
export const ConfirmacaoView = ({ pedido }: { pedido: IPedido }) => {
  const router = useRouter();
  const {
    valorEntregaBruto,
    valorItensBruto,
    valorTotalComDescontos,
    descontoEntrega,
    descontoItens,
  } = obterValoresDoPedido(pedido);
  const info: IInfo[] = (() => {
    const _info: IInfo[] = [];
    _info.push({ titulo: "Produtos", valor: valorItensBruto });
    if (pedido.tipo === "entrega")
      _info.push({ titulo: "Taxa de entrega", valor: valorEntregaBruto });

    if (descontoEntrega || descontoItens)
      _info.push({
        titulo: "Descontos",
        valor: descontoEntrega + descontoItens,
        negativo: true,
        cor: colors.checkedDark,
        bold: true,
      });

    _info.push({ titulo: "Total", valor: valorTotalComDescontos, bold: true });

    return _info;
  })();
  return (
    <ConfirmacaoViewStyle>
      <main className="menu">
        <TextContainer
          title="Revise seu pedido"
          description="Confira todas as informações e se tiver tudo certo, clique em continuar"
        />

        <ul className="itens no-scroll">
          {pedido.itens.map((item) => {
            return <Item key={item.id} item={item} pedido={pedido} />;
          })}
        </ul>

        {/* <Endereco e={pedido.endereco} tipo={pedido.tipo} /> */}
        <div className="bottom-info">
          {info.map((x, i) => {
            return (
              <div key={i} className="info-item">
                <span className="titulo">{x.titulo}:</span>
                <span
                  className="valor"
                  style={{
                    color: x.cor ?? undefined,
                    fontWeight: x.bold ? "bold" : "normal",
                  }}
                >
                  {x.negativo ? `- ` : ""}
                  {formatCurrency(x.valor)}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      <BottomControls
        backButton={true}
        primaryButton={{
          text: "Continuar",
          click: () => {
            router.push("/pedido/pagamento");
          },
        }}
      />
    </ConfirmacaoViewStyle>
  );
};
