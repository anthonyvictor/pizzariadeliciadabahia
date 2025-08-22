import { IPixRecebido } from "tpdb-lib";

export const sortPixRecebidos = (pixRecebidos: IPixRecebido[] | undefined) => {
  if (!pixRecebidos) return [];
  const r = pixRecebidos.sort(
    (a, b) => b.criadoEm.getTime() - a.criadoEm.getTime()
  );

  return r as IPixRecebido[];
};
