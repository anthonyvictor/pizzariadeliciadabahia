import { ICliente } from "tpdb-lib";
import { create } from "zustand";

interface ClienteState {
  cliente: ICliente | null;
  login: (cliente: ICliente) => void;
  logout: () => void;
}

export const useClienteStore = create<ClienteState>((set) => ({
  cliente: null,
  login: (cli) =>
    set(() => ({
      cliente: cli,
    })),
  logout: () => set({ cliente: null }),
}));
