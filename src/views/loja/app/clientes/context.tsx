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
import { ICliente } from "tpdb-lib";
import { ClienteView } from "./editor";
import { dvEst } from "@models/deveEstar";

type IClientesContext = {
  clientes: ICliente[];
  setClientes: SetState<ICliente[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
};
const ClientesContext = createContext<IClientesContext>({} as IClientesContext);

export const ClientesProvider = ({ children }: { children: ReactNode }) => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [editando, setEditando] = useState<undefined | string>();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await api.get("/clientes");

        console.log(res);
        if (res?.data?.length) setClientes(res.data);
      } catch (err: any) {
        toast.error(err.message);
        console.error(err);
      }
    };

    // 🔥 chama imediatamente
    fetchClientes();

    // 🔁 depois a cada 10s
    const timer = setInterval(fetchClientes, 5 * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ClientesContext.Provider
      value={{ clientes, setClientes, editando, setEditando }}
    >
      {editando === undefined ? children : <ClienteView />}
    </ClientesContext.Provider>
  );
};

export const useClientes = () => useContext(ClientesContext);
