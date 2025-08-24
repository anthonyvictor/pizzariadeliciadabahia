import { IBebida } from "tpdb-lib";

export const abreviarBebida = (bebida: string, abreviarMaximo = false) => {
  let res = bebida.replace(/(REFRIGERANTE|CERVEJA|ENERG(É|E)TICO) /gi, "");

  if (abreviarMaximo) {
    res = res
      .replace(/LARANJA/gi, "LAR.")
      .replace(/GUARANÁ/gi, "GUAR.")
      .replace(/ANTÁRCTICA/gi, "ANTÁRCT.")
      .replace(/FRUTAS CÍTRICAS/gi, "FT.CT.");
  }

  return res;
};

export const sortBebidas = (bebidas: IBebida[] | undefined) => {
  if (!bebidas) return [];
  const r = bebidas
    .sort((a, b) => a.vendidos - b.vendidos)
    .map((x) => ({ ...x, tipo: "bebida" }))
    .reverse();

  return r as IBebida[];
};
