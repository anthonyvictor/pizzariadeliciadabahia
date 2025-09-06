import { IPagamentoTipo, IPedido } from "tpdb-lib";
import { ICupom, IAlvoCupom } from "tpdb-lib";
import { obterValoresDoPedido } from "./pedidos";

export const sortCupons = (cupons: ICupom[] | undefined) => {
  if (!cupons) return [];
  const r = cupons
    .sort((a, b) =>
      a.vendidos !== b.vendidos ? a.vendidos - b.vendidos : b.valor - a.valor
    )
    .map((x) => ({ ...x }))
    .reverse();

  return r as ICupom[];
};

export const analisarRegrasCupomPedido = (
  pedido: IPedido,
  cupom: ICupom,
  ignorarRegrasPagamento?: boolean
) => {
  if (!cupom) return false;

  const { valorTotalComDescontos } = obterValoresDoPedido(pedido);

  for (let cond of (cupom?.condicoes ?? []).filter((x) => x.ativa)) {
    if (cond.tipo === "min_valor_pedido" && valorTotalComDescontos < cond.valor)
      return false;
    if (cond.tipo === "max_valor_pedido" && valorTotalComDescontos > cond.valor)
      return false;
    if (!ignorarRegrasPagamento) {
      if (
        cond.tipo === "metodo_pagamento" &&
        valorTotalComDescontos >
          pedido.pagamentos
            .filter((x) => (cond.valor as IPagamentoTipo[]).includes(x.tipo))
            .reduce((acc, curr) => acc + curr.valor, 0)
      )
        return false;
    }
  }
  for (let exc of (cupom.excecoes ?? []).filter((x) => x.ativa)) {
    if (exc.tipo === "min_valor_pedido" && valorTotalComDescontos > exc.valor)
      return false;
    if (exc.tipo === "max_valor_pedido" && valorTotalComDescontos < exc.valor)
      return false;
    if (!ignorarRegrasPagamento) {
      if (
        exc.tipo === "metodo_pagamento" &&
        valorTotalComDescontos <
          pedido.pagamentos
            .filter((x) => (exc.valor as IPagamentoTipo[]).includes(x.tipo))
            .reduce((acc, curr) => acc + curr.valor, 0)
      )
        return false;
    }
  }
  return true;
};

export function obterValorDescontoReal(
  valor: number,
  desconto: number,
  tipo: "percentual" | "fixo",
  max?: number
): number {
  if (valor <= 0 || desconto <= 0) return 0;

  let descontoReal = Number(
    (tipo === "percentual" ? (valor * desconto) / 100 : desconto).toFixed(2)
  );

  // Limita ao valor do pedido
  descontoReal = Math.min(descontoReal, valor);

  // Se maxDesconto foi informado, limita também a ele
  if (typeof max === "number" && max > 0) {
    descontoReal = Math.min(descontoReal, max);
  }

  descontoReal = Number(descontoReal.toFixed(2));

  return descontoReal;
}

export const analisarCodigoCupom = (
  cupom: ICupom,
  codigo: string | undefined
) =>
  !cupom
    ? false
    : !cupom.condicoes.some((y) => y.tipo === "codigo") ||
      cupom.condicoes.some((y) => y.tipo === "codigo" && y.valor === codigo);

export const obterDescontos = (
  pedido: IPedido,
  _cupons: ICupom[],
  ignorarRegrasPagamento?: boolean
) => {
  const cupons = (_cupons ?? [])
    .filter((x) => analisarRegrasCupomPedido(pedido, x, ignorarRegrasPagamento))
    .filter((x) => analisarCodigoCupom(x, pedido.codigoCupom));

  const { valorTotalBruto, valorEntregaBruto, valorItensBruto } =
    obterValoresDoPedido(pedido);
  const filtrarPorAlvo = (tipo: IAlvoCupom) =>
    cupons.filter((x) => x.alvo === tipo);

  const obterDescontoCupons = (c: ICupom[], valor: number) =>
    c.reduce(
      (acc, curr) =>
        acc +
        obterValorDescontoReal(
          acc ? valor - acc : valor,
          curr.valor,
          curr.tipo
        ),
      0
    );
  const descontoItens = obterDescontoCupons(
    filtrarPorAlvo("itens"),
    valorItensBruto
  );
  const descontoEntrega = obterDescontoCupons(
    filtrarPorAlvo("entrega"),
    valorEntregaBruto
  );
  const basePedidoDesconto = valorTotalBruto - descontoEntrega - descontoItens;
  const descontoPedido = obterDescontoCupons(
    filtrarPorAlvo("pagamento"),
    basePedidoDesconto
  );

  return { descontoItens, descontoEntrega, descontoPedido };
};
