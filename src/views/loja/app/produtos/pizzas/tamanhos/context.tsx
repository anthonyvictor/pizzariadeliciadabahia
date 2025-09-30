import { SetState } from "@config/react";
import { api } from "@util/axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { IPizzaTamanho } from "tpdb-lib";
import { TamanhoView } from "./tamanho";

type ITamanhosContext = {
  tamanhos: IPizzaTamanho[];
  setTamanhos: SetState<IPizzaTamanho[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
};
const TamanhosContext = createContext<ITamanhosContext>({} as ITamanhosContext);

export const TamanhosProvider = ({ children }: { children: ReactNode }) => {
  const [tamanhos, setTamanhos] = useState<IPizzaTamanho[]>([]);
  const [editando, setEditando] = useState<undefined | string>();

  useEffect(() => {
    api
      .get("/pizzas/tamanhos", {
        params: {
          deveEstar: {},
        },
      })
      .then((res) => {
        if (res?.data?.length) setTamanhos(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  return (
    <TamanhosContext.Provider
      value={{ tamanhos, setTamanhos, editando, setEditando }}
    >
      {editando === undefined ? children : <TamanhoView />}
    </TamanhosContext.Provider>
  );
};

export const useTamanhos = () => useContext(TamanhosContext);
