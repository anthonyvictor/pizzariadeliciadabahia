import {
  IPagamentoPedido,
  IPagamentoPedidoEspecie,
  IPagamentoTipo,
  IPedido,
} from "tpdb-lib";
import { IMetodo } from "../types";
import { MetodoStyle } from "./styles";
import { MdDiscount } from "react-icons/md";
import { formatCurrency } from "@util/format";
import { obterDescontos, obterValorDescontoReal } from "@util/cupons";
import { ICupom } from "tpdb-lib";
import { useEffect, useState } from "react";
import { colors } from "@styles/colors";
import { useRouter } from "next/router";
import { usePagamentoStore } from "src/infra/zustand/pagamentos";
import { MetodoModal } from "../metodoModal";
import { usePedidoStore } from "src/infra/zustand/pedido";

export const Metodo = ({
  metodo: m,
  valorTotal,
  valorDefinido,
  valorItens,
  cupomPagamento: cupom,
}: {
  metodo: IMetodo;
  valorTotal: number;
  valorItens: number;
  valorDefinido: number;
  cupomPagamento: ICupom | null;
}) => {
  // const [open, setOpen] = useState(false);

  const { pedido } = usePedidoStore();

  const padding = "20px 15px";
  const { pagamentos, addPagamento, deletePagamento } = usePagamentoStore();
  const pagsMetodo = pagamentos.filter((x) => x.tipo === m.tipo);
  const totalMetodo = pagsMetodo.reduce((a, b) => a + b.valor, 0);

  const cupomAplicavel = (ignorarTotalMetodo?: boolean) => {
    if (
      !cupom ||
      (!ignorarTotalMetodo &&
        (!totalMetodo ||
          totalMetodo < (cupom.alvo === "itens" ? valorItens : valorTotal)))
    )
      return false;
    for (let cond of cupom?.condicoes ?? []) {
      if (
        cond.tipo in ["bairros", "ceps", "max_distancia", "min_distancia"] &&
        !pedido.endereco?.enderecoOriginal?.cep
      )
        return false;
      if (
        cond.tipo === "metodo_pagamento" &&
        !cond.valor.some((x) => x === m.tipo)
      )
        return false;
      if (
        cond.tipo === "bairros" &&
        !cond.valor.some(
          (x) =>
            x.toLowerCase() ===
            pedido.endereco?.enderecoOriginal?.bairro?.toLowerCase?.()
        )
      )
        return false;
      if (
        cond.tipo === "ceps" &&
        !cond.valor.some(
          (x) =>
            x.replace(/\D+/g, "") ===
            pedido.endereco?.enderecoOriginal?.cep?.replace?.(/\D+/g, "")
        )
      )
        return false;
      if (
        cond.tipo === "max_distancia" &&
        cond.valor > (pedido.endereco?.enderecoOriginal?.distancia_metros ?? 0)
      )
        return false;
      if (
        cond.tipo === "min_distancia" &&
        cond.valor <
          (pedido.endereco?.enderecoOriginal?.distancia_metros ?? 1000000000)
      )
        return false;
    }
    for (let exc of cupom.excecoes ?? []) {
      if (!pedido.endereco?.enderecoOriginal?.cep) return true;
      if (
        exc.tipo === "metodo_pagamento" &&
        exc.valor.some((x) => x === m.tipo)
      )
        return false;
      if (
        exc.tipo === "bairros" &&
        exc.valor.some(
          (x) =>
            x.toLowerCase() ===
            pedido.endereco?.enderecoOriginal?.bairro.toLowerCase()
        )
      )
        return false;
      if (
        exc.tipo === "ceps" &&
        exc.valor.some(
          (x) =>
            x.replace(/\D+/g, "") ===
            pedido.endereco?.enderecoOriginal?.cep?.replace?.(/\D+/g, "")
        )
      )
        return false;
      if (
        exc.tipo === "max_distancia" &&
        exc.valor < (pedido.endereco?.enderecoOriginal?.distancia_metros ?? 0)
      )
        return false;
      if (
        exc.tipo === "min_distancia" &&
        exc.valor >
          (pedido.endereco?.enderecoOriginal?.distancia_metros ?? 1000000000)
      )
        return false;
    }

    return true;
  };

  const descontoAplicavel = cupomAplicavel(true);

  const [descontoReal] = useState<number>(
    cupomAplicavel()
      ? obterValorDescontoReal(
          cupom.alvo === "itens" ? valorItens : totalMetodo,
          cupom.valor,
          cupom.tipo,
          cupom.maxDesconto,
          pedido.cliente.dadosExtras.find((x) => x.chave === "randomCentavos")
            ?.valor ?? 0
        )
      : 0
  );

  const totalMetodoComDesconto = descontoReal
    ? totalMetodo - descontoReal
    : totalMetodo;

  const router = useRouter();
  const { metodo, ...rest } = router.query;
  const openModal = (metodo: IPagamentoTipo) => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, metodo } },
      undefined,
      { shallow: true }
    );
  };

  const closeModal = () => {
    const { metodo, ...rest } = router.query;
    router.replace({ pathname: router.pathname, query: rest }, undefined, {
      shallow: true,
    });
  };

  // Fecha modal com botão voltar do celular
  useEffect(() => {
    const handlePopState = () => {
      if (metodo) {
        closeModal();
      } else {
        router.replace("/pedido");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [metodo]);

  const pagComTroco = pagsMetodo
    ? pagsMetodo.find(
        (x) => x.tipo === "especie" && (x.trocoPara ?? 0) > x.valor
      )
    : undefined;
  return (
    <MetodoStyle
    //   style={{ padding: open ? padding : undefined }}
    >
      <header
        onClick={() => {
          // setOpen((prev) => !prev)
          if (
            valorDefinido < valorTotal ||
            pagamentos.some((pag) => pag.tipo === m.tipo)
          ) {
            const pagAdicionado = pagamentos.find((pag) => pag.tipo === m.tipo);
            if (pagAdicionado) deletePagamento(pagAdicionado.id);
            openModal(m.tipo);
          }
        }}
        style={{
          padding,
          opacity:
            valorDefinido >= valorTotal &&
            !pagamentos.some((x) => x.tipo === m.tipo)
              ? ".8"
              : undefined,
        }}
        //   style={{ padding: !open ? padding : undefined }}
      >
        <nav className="left">
          <h3 className="icone-nome">
            <div className="icone" style={{ background: m.cor }}>
              <m.icone />
            </div>
            {m.titulo}
          </h3>
          {!!m.cupom && descontoAplicavel && (
            <small className="cupom">
              <span className="cupom-icone">
                <MdDiscount />
              </span>
              <span className="cupom-nome">
                Ganhe{" "}
                <strong>
                  {m.cupom.valor}
                  {m.cupom.tipo === "percentual" ? "%" : " reais"}
                </strong>
                de desconto{" "}
                {m.cupom.alvo === "pagamento"
                  ? `pagando ${m.legenda}`
                  : m.cupom.alvo === "itens"
                  ? "nos itens"
                  : ""}
                {!!m.cupom.maxDesconto &&
                  ` (até ${formatCurrency(m.cupom.maxDesconto)})`}
              </span>
            </small>
          )}
        </nav>

        <div className="right">
          <h6 className="item-price">
            {!!totalMetodo && (
              <>
                <span
                  className="price"
                  style={{
                    color: descontoReal ? colors.checkedLight : undefined,
                  }}
                >
                  {!!descontoReal && (
                    <span className="price-title">Você vai pagar</span>
                  )}
                  <span>{formatCurrency(totalMetodoComDesconto)}</span>
                </span>
                {!!descontoReal && (
                  <span
                    className="original-price"
                    style={{ textDecoration: "line-through" }}
                  >
                    {formatCurrency(totalMetodo)}
                  </span>
                )}

                {!!pagComTroco && (
                  <small className="change">
                    Troco p/{(pagComTroco as IPagamentoPedidoEspecie).trocoPara}
                  </small>
                )}
              </>
            )}
          </h6>
          <div className="checker">
            <span></span>
          </div>
        </div>
      </header>
      {metodo === m.tipo && (
        <MetodoModal
          m={m}
          valorDefinido={valorDefinido}
          valorTotal={valorTotal}
          onConfirm={(pag) => {
            addPagamento({
              ...pag,
              desconto:
                cupomAplicavel(true) &&
                pag.valor >= (cupom.alvo === "itens" ? valorItens : valorTotal)
                  ? obterValorDescontoReal(
                      cupom.alvo === "itens" ? valorItens : pag.valor,
                      cupom.valor,
                      cupom.tipo,
                      cupom.maxDesconto,
                      pedido.cliente.dadosExtras.find(
                        (x) => x.chave === "randomCentavos"
                      )?.valor ?? 0
                    )
                  : 0,
            });
            closeModal();
          }}
          onClose={() => {
            closeModal();
          }}
        />
      )}
    </MetodoStyle>
  );
};

// {!!pagsMetodo.length && (
//         <ul className="pagamentos">
//           {pagsMetodo.map((pag) => (
//             <li className="pagamento" key={pag.id}>
//               {/* {m.cupom && (<h3 className="old-valor">{formatCurrency()}</h3>)} */}
//               <h3 className="valor">{formatCurrency(pag.valor)}</h3>
//               <small className="descricao">
//                 {pag.tipo === "especie"
//                   ? pag.trocoPara > pag.valor
//                     ? `Troco p/${pag.trocoPara}`
//                     : "Não precisa de troco"
//                   : ""}
//               </small>
//             </li>
//           ))}
//         </ul>
//       )}
