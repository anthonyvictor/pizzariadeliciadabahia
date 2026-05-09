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
import { IPizzaSabor, IPizzaTamanho, IPizzaIngrediente } from "tpdb-lib";
import { SaborView } from "./editor";

type ISaboresContext = {
  sabores: IPizzaSabor[];
  setSabores: SetState<IPizzaSabor[]>;
  editando: undefined | string;
  tamanhos: IPizzaTamanho[];
  setEditando: SetState<undefined | string>;
  ingredientes: IPizzaIngrediente[];
  setIngredientes: SetState<IPizzaIngrediente[]>;
};
const SaboresContext = createContext<ISaboresContext>({} as ISaboresContext);

export const SaboresProvider = ({ children }: { children: ReactNode }) => {
  const [sabores, setSabores] = useState<IPizzaSabor[]>([]);
  const [ingredientes, setIngredientes] = useState<IPizzaIngrediente[]>([]);
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
    api
      .get("/pizzas/ingredientes")
      .then((res) => {
        if (res?.data?.length) setIngredientes(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  return (
    <SaboresContext.Provider
      value={{
        sabores,
        setSabores,
        editando,
        setEditando,
        tamanhos,
        ingredientes,
        setIngredientes,
      }}
    >
      {editando === undefined ? children : <SaborView />}
    </SaboresContext.Provider>
  );
};

export const useSabores = () => useContext(SaboresContext);
