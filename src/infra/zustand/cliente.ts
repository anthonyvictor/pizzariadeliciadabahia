import { ICliente } from "tpdb-lib";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClienteState {
  cliente: ICliente | null;
  setCliente: (cliente?: ICliente | undefined) => void;
}

export const useClienteStore = create<ClienteState>((set) => ({
  cliente: null,
  setCliente: (cli) =>
    set(() => ({
      cliente: cli,
    })),
}));

// export const useClienteStore = create<ClienteState>()(
//   persist(
//     (set) => ({
//       cliente: null,
//       setCliente: (dados) => set({ cliente: dados || null }),
//     }),
//     {
//       name: "cliente",
//       // partialize: (state) => ({
//       //   // salva apenas o id no storage
//       //   cliente: state.cliente ? { id: state.cliente.id } : null,
//       // }),
//       // merge: (persistedState, currentState) => {
//       //   // reconstroi o estado usando o id salvo
//       //   const { cliente } = persistedState as ClienteState;
//       //   return {
//       //     ...currentState,
//       //     cliente: cliente ? ({ id: cliente.id } as ICliente) : null,
//       //   };
//       // },
//     }
//   )
// );
