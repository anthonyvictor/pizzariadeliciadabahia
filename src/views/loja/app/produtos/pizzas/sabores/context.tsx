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
import { IPizzaSabor } from "tpdb-lib";
import { SaborView } from "./sabor";

type ISaboresContext = {
  sabores: IPizzaSabor[];
  setSabores: SetState<IPizzaSabor[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
};
const SaboresContext = createContext<ISaboresContext>({} as ISaboresContext);

export const SaboresProvider = ({ children }: { children: ReactNode }) => {
  const [sabores, setSabores] = useState<IPizzaSabor[]>([]);
  const [editando, setEditando] = useState<undefined | string>();

  useEffect(() => {
    api
      .get("/pizzas/sabores", {
        params: {
          deveEstar: {},
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
      value={{ sabores, setSabores, editando, setEditando }}
    >
      {editando === undefined ? children : <SaborView />}
    </SaboresContext.Provider>
  );
};

export const useSabores = () => useContext(SaboresContext);
