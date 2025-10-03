import {
  IPizzaBorda,
  IPizzaEspessura,
  IPizzaExtra,
  IPizzaPonto,
  IPizzaSabor,
  IPizzaTamanho,
} from "tpdb-lib";
import { sortDisp } from "./array";

export const sortTamanhos = (tamanhos: IPizzaTamanho[]) => {
  const r = sortDisp(
    tamanhos.sort((a, b) =>
      a.valorMin != b.valorMin
        ? (b.valorMin ?? 0) - (a.valorMin ?? 0)
        : b.tamanhoAprox - a.tamanhoAprox
    )
  );

  return r as IPizzaTamanho[];
};
export const sortSabores = (sabores: IPizzaSabor[]) => {
  const r = sabores.sort((a, b) =>
    a.valorMedio != b.valorMedio
      ? a.valorMedio - b.valorMedio
      : a.nome.localeCompare(b.nome)
  );

  return r as IPizzaSabor[];
};

export const aplicarValorMinTamanho = (
  tamanho: IPizzaTamanho | undefined,
  sabores: IPizzaSabor[] | undefined
) => {
  if (!tamanho) return undefined;

  const valores = (sabores ?? []).map((x) => x.valores).flat();
  const valoresTamanho = valores
    .filter((y) => y.tamanhoId === tamanho.id)
    .map((y) => y.valor);

  return {
    ...tamanho,
    valorMin: valoresTamanho.length ? Math.min(...valoresTamanho) : null,
    tipo: "pizza",
  };
};
export const aplicarValorMinTamanhos = (
  tamanhos: IPizzaTamanho[] | undefined,
  sabores: IPizzaSabor[] | undefined
) => {
  if (!tamanhos) return [];

  const valores = (sabores ?? []).map((x) => x.valores).flat();
  return tamanhos.map((x) => {
    const valoresTamanho = valores
      .filter((y) => y.tamanhoId === x.id)
      .map((y) => y.valor);

    return {
      ...x,
      valorMin: valoresTamanho.length ? Math.min(...valoresTamanho) : null,
      tipo: "pizza",
    };
  });
};

export const aplicarValorMedSabores = (sabores: IPizzaSabor[] | undefined) => {
  if (!sabores) return [];
  return sabores.map((x) => {
    return {
      ...x,
      valorMedio:
        x.valores.reduce((acc, curr) => acc + curr.valor, 0) / x.valores.length,
    };
  });
};

export const sortBordas = (bordas: IPizzaBorda[] | undefined) => {
  if (!bordas) return [];
  const r = bordas
    .sort((a, b) => (a.padrao === true ? -1 : a.valorMedio - b.valorMedio))
    .map((x) => ({ ...x, tipo: "borda" }));

  return r as IPizzaBorda[];
};

export const sortPontos = (pontos: IPizzaPonto[] | undefined) => {
  if (!pontos) return [];
  const r = pontos
    .sort((a, b) =>
      a.padrao === true
        ? -1
        : b.vendidos != a.vendidos
        ? a.vendidos - b.vendidos
        : a.valor - b.valor
    )
    .map((x) => ({ ...x, tipo: "extra" }));

  return r as IPizzaPonto[];
};
export const sortEspessuras = (espessuras: IPizzaEspessura[] | undefined) => {
  if (!espessuras) return [];
  const r = espessuras
    .sort((a, b) =>
      a.padrao === true
        ? -1
        : b.vendidos != a.vendidos
        ? a.vendidos - b.vendidos
        : a.valor - b.valor
    )
    .map((x) => ({ ...x, tipo: "extra" }));

  return r as IPizzaEspessura[];
};
export const sortExtras = (extras: IPizzaExtra[] | undefined) => {
  if (!extras) return [];
  const r = extras
    .sort((a, b) =>
      b.vendidos != a.vendidos ? b.vendidos - a.vendidos : a.valor - b.valor
    )
    .map((x) => ({ ...x, tipo: "extra" }));

  return r as IPizzaExtra[];
};

export const tamanhoDescricao = (t: IPizzaTamanho, abrev?: boolean) => {
  return abrev
    ? `${t.fatias}fat, ${t.maxSabores}sab, ${t.tamanhoAprox}cm`
    : `${t.fatias} fatia${t.fatias > 1 ? "s" : ""}, ${t.maxSabores} sabor${
        t.maxSabores > 1 ? "es" : ""
      }, ${t.tamanhoAprox}cm`;
};

export const abrevTamanho = (prod: string) => {
  let res = prod
    .replace(/PEQUENA/gi, "PEQ")
    .replace(/MÉDIA/gi, "MED")
    .replace(/GRANDE/gi, "GRA")
    .replace(/FAMÍLIA/gi, "FAM");

  return res;
};
