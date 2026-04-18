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
import { IPedido } from "tpdb-lib";
import { PedidoView } from "./editor";
import { dvEst } from "@models/deveEstar";

type IPedidosContext = {
  pedidos: IPedido[];
  setPedidos: SetState<IPedido[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
};
const PedidosContext = createContext<IPedidosContext>({} as IPedidosContext);

export const PedidosProvider = ({ children }: { children: ReactNode }) => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [editando, setEditando] = useState<undefined | string>();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await api.get("/pedidos");

        console.log(res);
        if (res?.data?.length) setPedidos(res.data);
      } catch (err: any) {
        toast.error(err.message);
        console.error(err);
      }
    };

    // 🔥 chama imediatamente
    fetchPedidos();

    // 🔁 depois a cada 10s
    const timer = setInterval(fetchPedidos, 5 * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <PedidosContext.Provider
      value={{ pedidos, setPedidos, editando, setEditando }}
    >
      {editando === undefined ? children : <PedidoView />}
    </PedidosContext.Provider>
  );
};

export const usePedidos = () => useContext(PedidosContext);
