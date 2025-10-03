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
import { ILanche } from "tpdb-lib";
import { LancheView } from "./editor";
import { dvEst } from "@models/deveEstar";

type ILanchesContext = {
  lanches: ILanche[];
  setLanches: SetState<ILanche[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
};
const LanchesContext = createContext<ILanchesContext>({} as ILanchesContext);

export const LanchesProvider = ({ children }: { children: ReactNode }) => {
  const [lanches, setLanches] = useState<ILanche[]>([]);
  const [editando, setEditando] = useState<undefined | string>();
  useEffect(() => {
    api
      .get("/lanches", {
        params: {
          deveEstar: 0,
        },
      })
      .then((res) => {
        if (res?.data?.length) setLanches(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  return (
    <LanchesContext.Provider
      value={{ lanches, setLanches, editando, setEditando }}
    >
      {editando === undefined ? children : <LancheView />}
    </LanchesContext.Provider>
  );
};

export const useLanches = () => useContext(LanchesContext);
