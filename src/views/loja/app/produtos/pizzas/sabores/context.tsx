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
import { IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import { SaborView } from "./editor";

type ISaboresContext = {
  sabores: IPizzaSabor[];
  setSabores: SetState<IPizzaSabor[]>;
  editando: undefined | string;
  tamanhos: IPizzaTamanho[];
  setEditando: SetState<undefined | string>;
};
const SaboresContext = createContext<ISaboresContext>({} as ISaboresContext);

export const SaboresProvider = ({ children }: { children: ReactNode }) => {
  const [sabores, setSabores] = useState<IPizzaSabor[]>([]);
  const [editando, setEditando] = useState<undefined | string>();
  const [tamanhos, setTamanhos] = useState<IPizzaTamanho[]>([]);
  useEffect(() => {
    api
      .get("/pizzas/tamanhos", {
        params: {
          deveEstar: 0,
        },
      })
      .then((res) => {
        if (res?.data?.length) setTamanhos(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });

    api
      .get("/pizzas/sabores", {
        params: {
          deveEstar: 0,
        },
      })
      .then((res) => {
        if (res?.data?.length) setSabores(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  return (
    <SaboresContext.Provider
      value={{ sabores, setSabores, editando, setEditando, tamanhos }}
    >
      {editando === undefined ? children : <SaborView />}
    </SaboresContext.Provider>
  );
};

export const useSabores = () => useContext(SaboresContext);
