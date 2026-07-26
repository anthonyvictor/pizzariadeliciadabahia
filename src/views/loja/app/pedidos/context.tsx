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
  deletarPedido: (id: string) => Promise<void>;
  finalizarPedido: (pedidoId: string) => Promise<void>;
  pedidosCarregados: boolean;
};
const PedidosContext = createContext<IPedidosContext>({} as IPedidosContext);

export const PedidosProvider = ({ children }: { children: ReactNode }) => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [pedidosCarregados, setPedidosCarregados] = useState<boolean>(false);
  const [editando, setEditando] = useState<undefined | string>();
  const [blockedFetch, setBlockedFetch] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (blockedFetch) return;
        const res = await api.get("/pedidos");

        console.log(res);
        if (res?.data?.length) setPedidos(res.data);
      } catch (err: any) {
        toast.error(err.message);
        console.error(err);
      } finally {
        setPedidosCarregados(true);
      }
    };

    // 🔥 chama imediatamente
    fetchPedidos();

    // 🔁 depois a cada 10s
    const timer = setInterval(fetchPedidos, 5 * 1000);

    return () => clearInterval(timer);
  }, []);

  const deletarPedido = async (id: string) => {
    try {
      setPedidos((prev) => prev.filter((x) => x.id !== id));

      setBlockedFetch(true);

      const res = await api.delete(`/pedidos/${id}`);

      console.log(res);
      if (res?.data?.length) setPedidos(res.data);
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setBlockedFetch(false);
    }
  };
  const finalizarPedido = async (pedidoId: string) => {
    try {
      setPedidos((prev) => prev.filter((x) => x.id !== pedidoId));

      setBlockedFetch(true);

      const res = await api.post(`/pedidos/finalizar`, { pedidoId });

      console.log(res);
      if (res?.data?.length) setPedidos(res.data);
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setBlockedFetch(false);
    }
  };

  return (
    <PedidosContext.Provider
      value={{
        pedidos,
        setPedidos,
        editando,
        setEditando,
        deletarPedido,
        finalizarPedido,
        pedidosCarregados,
      }}
    >
      {editando === undefined ? children : <PedidoView />}
    </PedidosContext.Provider>
  );
};

export const usePedidos = () => useContext(PedidosContext);
