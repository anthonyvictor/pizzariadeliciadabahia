import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModoState {
  modo: "cliente" | "autoatendimento" | "atendente";
  setModo: (m?: "cliente" | "autoatendimento" | "atendente") => void;
}

// export const useModoStore = create<ModoState>((set) => ({
//   modo: 'cliente',
//   setModo: (cli) =>
//     set(() => ({
//       modo: cli,
//     })),
// }));

export const useModoStore = create<ModoState>()(
  persist(
    (set) => ({
      modo: "cliente",
      setModo: (m) => set({ modo: m }),
    }),
    {
      name: "modo",
      // partialize: (state) => ({
      //   // salva apenas o id no storage
      //   modo: state.modo ? { id: state.modo.id } : null,
      // }),
      // merge: (persistedState, currentState) => {
      //   // reconstroi o estado usando o id salvo
      //   const { modo } = persistedState as ModoState;
      //   return {
      //     ...currentState,
      //     modo: modo ? ({ id: modo.id } as IModo) : null,
      //   };
      // },
    }
  )
);
