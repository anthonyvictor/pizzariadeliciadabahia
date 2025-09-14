import { IItemPedido, IRegraProduto } from "tpdb-lib";

// Verifica se um item atende a uma regra de produto simples
function itemAtendeRegraProduto(
  item: IItemPedido,
  regra: IRegraProduto
): boolean {
  if (regra.tipo !== item.tipo && regra.tipo !== "combo") {
    return false;
  }

  // Verificação por originalId (se for necessário validar um item específico)
  if (
    regra.originalId &&
    regra.originalId !== item.id &&
    regra.originalId !== item.comboId
  ) {
    return false;
  }

  const valorFinal = item.valor - (item.desconto ?? 0);

  if (regra.valorMin !== undefined && valorFinal < regra.valorMin) {
    return false;
  }
  if (regra.valorMax !== undefined && valorFinal > regra.valorMax) {
    return false;
  }

  return true;
}

// Verifica se um pedido atende uma regra de produto (considerando "ou")
export function pedidoAtendeRegraProduto(
  itens: IItemPedido[],
  regra: IRegraProduto
): boolean {
  // Caso tenha sub-regras (ou)
  if (regra.ou && regra.ou.length > 0) {
    // basta UMA das alternativas ser verdadeira
    return regra.ou.some((subRegra) =>
      pedidoAtendeRegraProduto(itens, subRegra)
    );
  }

  // Caso contrário, precisa existir pelo menos um item que atenda
  return itens.some((item) => itemAtendeRegraProduto(item, regra));
}
