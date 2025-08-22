import { IBebida } from "tpdb-lib";

export const abreviarBebida = (bebida: string) =>
  bebida.replace(/(REFRIGERANTE|CERVEJA|ENERG(É|E)TICO) /gi, "");

export const sortBebidas = (bebidas: IBebida[] | undefined) => {
  if (!bebidas) return [];
  const r = bebidas
    .sort((a, b) => a.vendidos - b.vendidos)
    .map((x) => ({ ...x, tipo: "bebida" }))
    .reverse();

  return r as IBebida[];
};
