// store/pagamentoStore.ts
import { IPagamentoPedido } from "tpdb-lib";
import { create } from "zustand";

interface PagamentoState {
  pagamentos: IPagamentoPedido[];
  addPagamento: (p: IPagamentoPedido) => void;
  clearPagamentos: () => void;
  deletePagamento: (id: string) => void;
}

export const usePagamentoStore = create<PagamentoState>((set) => ({
  pagamentos: [],
  addPagamento: (p) =>
    set((state) => ({
      pagamentos: [...state.pagamentos, p],
    })),
  clearPagamentos: () => set({ pagamentos: [] }),
  deletePagamento: (id) =>
    set((state) => ({
      pagamentos: state.pagamentos.filter((x) => x.id !== id),
    })),
}));
