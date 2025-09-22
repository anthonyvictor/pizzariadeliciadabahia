import { ICombo, IBebida, ILanche, IPizzaSabor } from "tpdb-lib";

export const sortCombos = (combos: ICombo[] | undefined) => {
  if (!combos) return [];
  const r = combos
    .sort((a, b) =>
      a.vendidos !== b.vendidos
        ? a.vendidos - b.vendidos
        : b.valorMin - a.valorMin
    )
    .map((x) => ({ ...x, tipo: "combo" }));

  return r as ICombo[];
};

export const aplicarValorMinCombo = (
  combo: ICombo,
  sabores: IPizzaSabor[],
  bebidas: IBebida[],
  lanches: ILanche[]
) => {
  combo.produtos.forEach((produto) => {
    if (produto.tipo === "pizza") {
      const obterValorMin = (sabs: IPizzaSabor[]) => {
        const valorMin = Math.min(
          ...sabs
            .map((x) => x.valores)
            .flat()
            .filter((x) => x.tamanhoId === produto.tamanho.id)
            .map((x) => x.valor)
        );
        return valorMin;
      };

      produto.valorMin =
        produto.sabores && produto.sabores?.length
          ? obterValorMin(
              sabores.filter((sab) =>
                (produto?.sabores ?? []).some((x) => x.id === sab.id)
              )
            )
          : obterValorMin(sabores);
    } else if (produto.tipo === "bebida") {
      produto.valorMin = Number(
        (
          Math.min(
            ...bebidas
              .filter((x) =>
                produto.bebidas?.length
                  ? (produto.bebidas ?? []).some((y) => y.id === x.id)
                  : true
              )
              .map((x) => x.valor)
          ) * (produto.min ?? 1)
        ).toFixed(2)
      );
    } else if (produto.tipo === "lanche") {
      produto.valorMin = Number(
        (
          Math.min(
            ...lanches
              .filter((x) =>
                produto.lanches?.length
                  ? (produto.lanches ?? []).some((y) => y.id === x.id)
                  : true
              )
              .map((x) => x.valor)
          ) * (produto.min ?? 1)
        ).toFixed(2)
      );
    }

    (produto.acoes ?? []).forEach((acao) => {
      switch (acao.tipo) {
        case "valor_fixo":
          produto.valorMin = Number(
            (
              acao.valor * (produto.tipo === "pizza" ? 1 : produto.min ?? 1)
            ).toFixed(2)
          );
          break;
        case "desconto_fixo":
          produto.valorMin = Number(
            (
              (produto.valorMin - acao.valor >= 0
                ? produto.valorMin - acao.valor
                : 0) * (produto.tipo === "pizza" ? 1 : produto.min ?? 1)
            ).toFixed(2)
          );
          break;
        case "desconto_percentual":
          const valorRealDesconto = produto.valorMin * (acao.valor / 100);
          produto.valorMin = Number(
            (
              (produto.valorMin -
                (acao.maxDesconto != null
                  ? valorRealDesconto > acao.maxDesconto
                    ? acao.maxDesconto
                    : valorRealDesconto
                  : valorRealDesconto)) *
              (produto.tipo === "pizza" ? 1 : produto.min ?? 1)
            ).toFixed(2)
          );

          break;
      }
    });
  });
  combo.valorMin = combo.produtos.reduce((acc, curr) => acc + curr.valorMin, 0);

  return { ...combo, tipo: "combo" };
};
