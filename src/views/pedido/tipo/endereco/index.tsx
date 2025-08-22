import { IEndereco } from "tpdb-lib";
import { ICupom } from "tpdb-lib";
import { formatCurrency } from "@util/format";
import { Tipo } from "../types";
import { SetState } from "@config/react";
import { obterValorDescontoReal } from "@util/cupons";
import { useState } from "react";
import { colors } from "@styles/colors";
import { EnderecoStyle } from "./styles";

export const Endereco = ({
  e,
  cupomEntrega,
  tipo,
  setTipo,
}: {
  e: IEndereco;
  cupomEntrega: ICupom | null;
  tipo: Tipo;
  setTipo: SetState<Tipo>;
}) => {
  const cupomAplicavel = () => {
    if (!cupomEntrega) return false;
    for (let cond of cupomEntrega?.condicoes ?? []) {
      if (
        cond.tipo === "bairros" &&
        !cond.valor.some((x) => x.toLowerCase() === e.bairro.toLowerCase())
      )
        return false;
      if (
        cond.tipo === "ceps" &&
        !cond.valor.some(
          (x) => x.replace(/\D+/g, "") === e.cep.replace(/\D+/g, "")
        )
      )
        return false;
      if (
        cond.tipo === "max_distancia" &&
        cond.valor > (e.distancia_metros ?? 0)
      )
        return false;
      if (
        cond.tipo === "min_distancia" &&
        cond.valor < (e.distancia_metros ?? 1000000000)
      )
        return false;
    }
    for (let exc of cupomEntrega.excecoes ?? []) {
      if (
        exc.tipo === "bairros" &&
        exc.valor.some((x) => x.toLowerCase() === e.bairro.toLowerCase())
      )
        return false;
      if (
        exc.tipo === "ceps" &&
        exc.valor.some(
          (x) => x.replace(/\D+/g, "") === e.cep.replace(/\D+/g, "")
        )
      )
        return false;
      if (exc.tipo === "max_distancia" && exc.valor < (e.distancia_metros ?? 0))
        return false;
      if (
        exc.tipo === "min_distancia" &&
        exc.valor > (e.distancia_metros ?? 1000000000)
      )
        return false;
    }

    return true;
  };

  const [descontoReal] = useState<number>(
    cupomAplicavel()
      ? obterValorDescontoReal(
          e.taxa ?? 0,
          cupomEntrega.valor,
          cupomEntrega.tipo,
          cupomEntrega.maxDesconto
        )
      : 0
  );

  const taxaComDesconto = descontoReal
    ? (e.taxa ?? 0) - descontoReal
    : e.taxa ?? 0;

  return (
    <EnderecoStyle
      onClick={async () => {
        setTipo({
          type: "entrega",
          endereco: { ...e, desconto: descontoReal },
        });
      }}
      className={`item ${
        tipo?.type === "entrega" && tipo?.endereco?.id === e.id ? "checked" : ""
      }`}
    >
      <aside className="item-left">
        <h4 className="item-title">
          {[e.rua, e.numero, e.bairro].filter(Boolean).join(", ").toUpperCase()}
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
                  color: descontoReal ? colors.checkedLight : undefined,
                }}
              >
                {taxaComDesconto ? formatCurrency(taxaComDesconto) : "GRÁTIS!"}
              </span>
              {!!descontoReal && (
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
    </EnderecoStyle>
  );
};
