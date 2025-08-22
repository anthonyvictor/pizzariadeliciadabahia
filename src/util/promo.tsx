import { IPedido } from "tpdb-lib";

export const taxaGratisAteTalHoras = (order: IPedido) => {
  const dataPromo = new Date("2025-02-19 21:05:00");

  const now = new Date();

  return (
    dataPromo.getTime() > now.getTime() &&
    order.itens.reduce((acc, curr) => acc + curr.valor, 0) >= 36
  );
};
