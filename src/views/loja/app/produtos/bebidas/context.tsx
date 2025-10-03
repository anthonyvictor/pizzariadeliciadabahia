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
import { IBebida } from "tpdb-lib";
import { BebidaView } from "./editor";
import { dvEst } from "@models/deveEstar";

type IBebidasContext = {
  bebidas: IBebida[];
  setBebidas: SetState<IBebida[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
};
const BebidasContext = createContext<IBebidasContext>({} as IBebidasContext);

export const BebidasProvider = ({ children }: { children: ReactNode }) => {
  const [bebidas, setBebidas] = useState<IBebida[]>([]);
  const [editando, setEditando] = useState<undefined | string>();
  useEffect(() => {
    api
      .get("/bebidas", {
        params: {
          deveEstar: 0,
        },
      })
      .then((res) => {
        if (res?.data?.length) setBebidas(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  return (
    <BebidasContext.Provider
      value={{ bebidas, setBebidas, editando, setEditando }}
    >
      {editando === undefined ? children : <BebidaView />}
    </BebidasContext.Provider>
  );
};

export const useBebidas = () => useContext(BebidasContext);
