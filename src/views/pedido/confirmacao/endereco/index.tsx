import { IEnderecoPedido } from "tpdb-lib";
import { formatCurrency } from "@util/format";
import { colors } from "@styles/colors";
import { EnderecoStyle } from "../../tipo/components/endereco/styles";
import { IPedidoTipo } from "tpdb-lib";

export const Endereco = ({
  e,
  tipo,
}: {
  e: IEnderecoPedido;
  tipo: IPedidoTipo;
}) => {
  return (
    <EnderecoStyle className={`item`}>
      {tipo === "retirada" ? (
        <>
          <aside className="item-left">
            <h2 className="item-type">Retirar na pizzaria 🍕</h2>
            <small className="item-description">
              {"Ladeira do Jardim Zoológico, 427-B, Ondina".toUpperCase()}
            </small>
          </aside>
          <aside className="item-right">
            <p className="item-price">
              <b className="free-price">GRÁTIS!</b>
            </p>
          </aside>
        </>
      ) : (
        <>
          <aside className="item-left">
            <h2 className="item-type">Entrega 🛵</h2>
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
              {e.taxa ? (
                <>
                  <span
                    className="price"
                    style={{
                      color: e.desconto ? colors.checkedLight : undefined,
                    }}
                  >
                    {e.taxa - e.desconto
                      ? formatCurrency(e.taxa - e.desconto)
                      : "GRÁTIS!"}
                  </span>
                  {!!e.desconto && (
                    <span
                      className="original-price"
                      style={{ textDecoration: "line-through" }}
                    >
                      {formatCurrency(e.taxa ?? 0)}
                    </span>
                  )}
                </>
              ) : (
                <span className="free-price">Taxa à definir!</span>
              )}
            </h6>
          </aside>
        </>
      )}
    </EnderecoStyle>
  );
};
