import { IPedido } from "tpdb-lib";
import { create } from "zustand";

interface PedidoState {
  pedido: IPedido | null;
  setPedido: (pedido?: IPedido | undefined) => void;
}

export const usePedidoStore = create<PedidoState>((set) => ({
  pedido: null,
  setPedido: (cli) =>
    set(() => ({
      pedido: cli,
    })),
}));
