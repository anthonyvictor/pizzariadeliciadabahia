import { ILanche } from "tpdb-lib";
import { sortDisp } from "./array";

export const abreviarLanche = (lanche: string) =>
  lanche.replace(/(SALGADO) /gi, "");

export const sortLanches = (lanches: ILanche[] | undefined) => {
  if (!lanches) return [];
  const r = sortDisp(
    lanches
      .sort((a, b) => a.vendidos - b.vendidos)
      .map((x) => ({ ...x, tipo: "lanche" }))
      .reverse()
  );
  return r as ILanche[];
};
