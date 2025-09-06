import { IEnderecoCliente, IEnderecoPedido } from "tpdb-lib";
import { formatCurrency } from "@util/format";
import { obterValorDescontoReal } from "@util/cupons";
import { useState } from "react";
import { colors } from "@styles/colors";
import { EnderecoStyle } from "./styles";
import { useTipoPage } from "../../context";
import { taxaAdicional } from "@util/dados";
import { CgTrash } from "react-icons/cg";
import { api } from "@util/axios";
import { useClienteStore } from "src/infra/zustand/cliente";
import { analisarRegrasEndereco } from "@util/regras";
import { usePedidoStore } from "src/infra/zustand/pedido";
import { obterValoresDoPedido } from "@util/pedidos";

export const Endereco = ({ e }: { e: IEnderecoCliente }) => {
  const { cupomEntrega: cupom, tipo, setTipo } = useTipoPage();
  const { cliente, setCliente } = useClienteStore();
  const { pedido } = usePedidoStore();
  const { valorItensComDesconto } = obterValoresDoPedido(pedido);
  const [descontoReal] = useState<number>(
    cupomAplicavel()
      ? obterValorDescontoReal(
          e.enderecoOriginal.taxa ?? 0,
          cupom.valor,
          cupom.tipo,
          cupom.maxDesconto
        )
      : 0
  );

  function cupomAplicavel() {
    if (!cupom) return false;
    if (!analisarRegrasEndereco(cupom, e?.enderecoOriginal)) return false;

    for (let cond of cupom?.condicoes ?? []) {
      if (
        cond.tipo === "min_valor_pedido" &&
        valorItensComDesconto < cond.valor
      )
        return false;
      if (
        cond.tipo === "max_valor_pedido" &&
        valorItensComDesconto > cond.valor
      )
        return false;

      cond.tipo === "max_distancia" &&
        console.log(
          cond.tipo,
          cond.valor,
          e?.enderecoOriginal?.distancia_metros,
          cond.valor < (e?.enderecoOriginal?.distancia_metros ?? 0)
        );
      if (
        cond.tipo === "max_distancia" &&
        cond.valor < (e?.enderecoOriginal?.distancia_metros ?? 0)
      )
        return false;

      if (
        cond.tipo === "min_distancia" &&
        cond.valor > (e?.enderecoOriginal?.distancia_metros ?? 1000000000)
      )
        return false;
    }
    for (let exc of cupom.excecoes ?? []) {
      if (exc.tipo === "min_valor_pedido" && valorItensComDesconto > exc.valor)
        return false;
      if (exc.tipo === "max_valor_pedido" && valorItensComDesconto < exc.valor)
        return false;
      if (
        exc.tipo === "max_distancia" &&
        exc.valor < (e?.enderecoOriginal?.distancia_metros ?? 0)
      )
        return false;
      if (
        exc.tipo === "min_distancia" &&
        exc.valor > (e?.enderecoOriginal?.distancia_metros ?? 1000000000)
      )
        return false;
    }

    return true;
  }

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
              {formatCurrency(
                eval(
                  `${
                    tipo.endereco.enderecoOriginal.taxa -
                    (tipo.endereco.desconto ?? 0)
                  } ${
                    tipo?.endereco?.metodo === "avancado" ? taxaAdicional : ""
                  }`
                )
              )}
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
        <button
          className="deletar"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await api.delete("/clientes/endereco", {
              params: {
                clienteId: cliente.id,
                enderecoId: e.id,
              },
            });
            setCliente({
              ...cliente,
              enderecos: cliente.enderecos.filter((x) => x.id !== e.id),
            });
          }}
        >
          <CgTrash />
        </button>
      </aside>
    </EnderecoStyle>
  );
};
