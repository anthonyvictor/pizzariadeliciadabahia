import {
  ICombo,
  IBebida,
  ILanche,
  IPizzaSabor,
  IPizzaTamanho,
  IProdutoComboPizza,
} from "tpdb-lib";

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

export const produtosDoComboDisponiveis = (
  combo: ICombo,
  tamanhos?: IPizzaTamanho[],
  sabores?: IPizzaSabor[],
  bebidas?: IBebida[],
  lanches?: ILanche[]
) => {
  const pizzasDoCombo = combo.produtos
    .filter((x) => x.tipo === "pizza")
    .map((x) => x as IProdutoComboPizza); //.tamanho

  for (const prod of combo.produtos) {
    if (prod.tipo === "pizza") {
      const saboresDoProd = (
        prod.sabores?.length
          ? prod.sabores.map((pi) => sabores.find((x) => x.id === pi.id))
          : sabores
      )
        .filter(Boolean)
        .filter(
          (x) => x.disponivel && x.visivel && x.emCondicoes && x.estoque !== 0
        );

      if (!saboresDoProd.length) return false;
    } else if (prod.tipo === "bebida") {
      const min = prod.min ?? 1;
      const itensDoProduto = (
        prod.bebidas?.length
          ? prod.bebidas.map((pi) => bebidas.find((x) => x.id === pi.id))
          : bebidas
      )
        .filter(Boolean)
        .filter(
          (x) => x.visivel && x.disponivel && x.emCondicoes && x.estoque !== 0
        );

      if (!itensDoProduto.length) return false;

      const estoqueMax = itensDoProduto.reduce(
        (acc, curr) => acc + (curr.estoque ?? 999999),
        0
      );

      if (min > estoqueMax) return false;
    } else if (prod.tipo === "lanche") {
      const min = prod.min ?? 1;

      const itensDoProduto = (
        prod.lanches?.length
          ? prod.lanches.map((pi) => lanches.find((x) => x.id === pi.id))
          : lanches
      )
        .filter(Boolean)
        .filter(
          (x) => x.visivel && x.disponivel && x.emCondicoes && x.estoque !== 0
        );

      if (!itensDoProduto.length) return false;

      const estoqueMax = itensDoProduto.reduce(
        (acc, curr) => acc + (curr.estoque ?? 999999),
        0
      );
      if (min > estoqueMax) return false;
    }
  }

  if (pizzasDoCombo.length) {
    for (const tam of tamanhos) {
      const tamCombo = pizzasDoCombo
        .map((x) => x.tamanho)
        .filter((x) => x.id === tam.id);

      if (
        tamCombo.length &&
        (!tam.disponivel ||
          !tam.visivel ||
          !tam.emCondicoes ||
          tam.estoque === 0 ||
          (tam.estoque ?? 999999999999) < tamCombo.length)
      )
        return false;
    }
  }

  return true;
};
