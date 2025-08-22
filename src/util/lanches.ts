import { ILanche } from "tpdb-lib";

export const abreviarLanche = (lanche: string) =>
  lanche.replace(/(SALGADO) /gi, "");

export const sortLanches = (lanches: ILanche[] | undefined) => {
  if (!lanches) return [];
  const r = lanches
    .sort((a, b) => a.vendidos - b.vendidos)
    .map((x) => ({ ...x, tipo: "lanche" }))
    .reverse();

  return r as ILanche[];
};
