import { IPagamentoPedido, IPagamentoTipo, IPedido } from "tpdb-lib";

export const obterValoresDoPedido = ({
  itens: _itens,
  endereco,
  pagamentos: _pagamentos,
}: IPedido) => {
  const itens = _itens?.length ? _itens : [];
  const pagamentos = _pagamentos?.length ? _pagamentos : [];
  const descontoItens = Number(
    itens.reduce((acc, curr) => acc + (curr.desconto ?? 0), 0).toFixed(2)
  );
  const valorItensBruto = Number(
    itens.reduce((acc, curr) => acc + curr.valor, 0).toFixed(2)
  );

  const valorItensComDesconto = valorItensBruto - descontoItens;
  const descontoEntrega = Number((endereco?.desconto ?? 0).toFixed(2));

  const valorEntregaBruto = Number((endereco?.taxa ?? 0).toFixed(2));
  const valorEntregaComDesconto = valorEntregaBruto - descontoEntrega;

  const valorTotalComDescontos = Number(
    (valorItensComDesconto + valorEntregaComDesconto).toFixed(2)
  );
  const valorTotalBruto = Number(
    (valorItensBruto + valorEntregaBruto).toFixed(2)
  );

  const valoresPagos = pagamentos.filter((x) => x.pagoEm);
  const valoresPendentes = pagamentos.filter((x) => !x.pagoEm);
  const fp = (pags: IPagamentoPedido[], tipo?: IPagamentoTipo) =>
    pags.filter((x) => (tipo ? x.tipo === tipo : true));
  const v = (pags: IPagamentoPedido[]) =>
    Number(pags.reduce((acc, curr) => acc + curr.valor, 0).toFixed(2));
  const valorPagamentos = {
    pix: {
      pago: v(fp(valoresPagos, "pix")),
      pend: v(fp(valoresPendentes, "pix")),
      total: v(fp(pagamentos, "pix")),
    },
    especie: {
      pago: v(fp(valoresPagos, "especie")),
      pend: v(fp(valoresPendentes, "especie")),
      total: v(fp(pagamentos, "especie")),
    },
    cartao: {
      pago: v(fp(valoresPagos, "cartao")),
      pend: v(fp(valoresPendentes, "cartao")),
      total: v(fp(pagamentos, "cartao")),
    },
    total: {
      pago: v(valoresPagos),
      pend: v(valoresPendentes),
      total: v(pagamentos),
    },
  };
  return {
    valorTotalBruto,
    valorTotalComDescontos,
    valorItensBruto,
    valorItensComDesconto,
    valorEntregaBruto,
    valorEntregaComDesconto,
    valorPagamentos,
    descontoEntrega,
    descontoItens,
  };
};
