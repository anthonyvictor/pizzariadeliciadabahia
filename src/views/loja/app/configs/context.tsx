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
import { IConfig } from "tpdb-lib";
import { ConfigView } from "./editor";
import { dvEst } from "@models/deveEstar";

type IConfigsContext = {
  configs: IConfig[];
  setConfigs: SetState<IConfig[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
};
const ConfigsContext = createContext<IConfigsContext>({} as IConfigsContext);

export const ConfigsProvider = ({ children }: { children: ReactNode }) => {
  const [configs, setConfigs] = useState<IConfig[]>([]);
  const [editando, setEditando] = useState<undefined | string>();
  useEffect(() => {
    api
      .get("/configs", {
        params: {
          deveEstar: 0,
        },
      })
      .then((res) => {
        if (res?.data?.length) setConfigs(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  return (
    <ConfigsContext.Provider
      value={{ configs, setConfigs, editando, setEditando }}
    >
      {editando === undefined ? children : <ConfigView />}
    </ConfigsContext.Provider>
  );
};

export const useConfigs = () => useContext(ConfigsContext);
