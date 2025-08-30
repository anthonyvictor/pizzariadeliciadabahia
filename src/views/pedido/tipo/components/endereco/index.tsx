import { IEnderecoCliente, IEnderecoPedido } from "tpdb-lib";
import { formatCurrency } from "@util/format";
import { obterValorDescontoReal } from "@util/cupons";
import { useState } from "react";
import { colors } from "@styles/colors";
import { EnderecoStyle } from "./styles";
import { cupomAplicavel } from "@util/enderecos/cupomAplicavel";
import { useTipoPage } from "../../context";

export const Endereco = ({ e }: { e: IEnderecoCliente }) => {
  const { cupomEntrega, tipo, setTipo } = useTipoPage();

  const [descontoReal] = useState<number>(
    cupomAplicavel(cupomEntrega, e.enderecoOriginal)
      ? obterValorDescontoReal(
          e.enderecoOriginal.taxa ?? 0,
          cupomEntrega.valor,
          cupomEntrega.tipo,
          cupomEntrega.maxDesconto
        )
      : 0
  );

  const metodoBasico =
    !tipo?.type ||
    (tipo?.type === "entrega" && tipo.endereco.metodo === "basico");

  const taxaComDesconto =
    descontoReal && metodoBasico
      ? (e.enderecoOriginal.taxa ?? 0) - descontoReal
      : e.enderecoOriginal.taxa ?? 0;

  return (
    <EnderecoStyle
      onClick={async () => {
        setTipo({
          type: "entrega",
          endereco: {
            ...e,
            desconto: descontoReal,
          } as unknown as IEnderecoPedido,
        });
      }}
      className={`item ${
        tipo?.type === "entrega" && tipo?.endereco?.id === e.id ? "checked" : ""
      }`}
    >
      <aside className="item-left">
        <h4 className="item-title">
          {[e?.enderecoOriginal?.rua, e.numero, e?.enderecoOriginal?.bairro]
            .filter(Boolean)
            .join(", ")
            .toUpperCase()}
        </h4>

        <p className="item-description">
          {[e.local, e.referencia].filter(Boolean).join(", ").toUpperCase()}
        </p>
      </aside>
      <aside className="item-right">
        <h6 className="item-price">
          {tipo?.type === "entrega" && tipo.endereco?.id === e.id ? (
            <span
              className="price"
              style={{
                color: colors.elements,
              }}
            >
              {formatCurrency(tipo.endereco.enderecoOriginal.taxa)}
            </span>
          ) : e.enderecoOriginal.taxa ? (
            <>
              {
                <span
                  className="price"
                  style={{
                    color:
                      descontoReal && metodoBasico
                        ? colors.checkedLight
                        : undefined,
                  }}
                >
                  {taxaComDesconto
                    ? formatCurrency(taxaComDesconto)
                    : "GRÁTIS!"}
                </span>
              }

              {!!descontoReal && !!metodoBasico && (
                <span
                  className="original-price"
                  style={{ textDecoration: "line-through" }}
                >
                  {formatCurrency(e.enderecoOriginal.taxa ?? 0)}
                </span>
              )}
            </>
          ) : (
            <span className="free-price">Taxa à definir!</span>
          )}
        </h6>
      </aside>
    </EnderecoStyle>
  );
};
