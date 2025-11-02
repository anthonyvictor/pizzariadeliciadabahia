import { SetState } from "@config/react";
import { api, axiosOk } from "@util/axios";
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
import { NoLogError } from "@models/error";
import { mergeArraysByKey } from "@util/array";

type IConfigsContext = {
  configs: IConfig[];
  setConfigs: SetState<IConfig[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
  carregando: boolean;
  setCarregando: SetState<boolean>;
  handleSubmit: (chave: IConfig["chave"], valor: any) => Promise<void>;
};
const ConfigsContext = createContext<IConfigsContext>({} as IConfigsContext);

export const ConfigsProvider = ({ children }: { children: ReactNode }) => {
  const [configs, setConfigs] = useState<IConfig[]>([]);
  const [editando, setEditando] = useState<undefined | string>();
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (chave: IConfig["chave"], valor: any) => {
    try {
      setCarregando(true);
      const res = await api.post("/configs", {
        chave,
        valor,
      });

      if (!axiosOk(res.status) || !res.data)
        throw new NoLogError("Erro ao Salvar");

      if (res.data) {
        setConfigs((prev) => mergeArraysByKey(prev, res.data, "chave"));
        setEditando(undefined);
      }
    } catch (err) {
      console.error(err);
      toast.error("Oops, não foi possível salvar!");
    } finally {
      setCarregando(false);
    }
  };
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
      value={{
        configs,
        setConfigs,
        editando,
        setEditando,
        carregando,
        setCarregando,
        handleSubmit,
      }}
    >
      {editando === undefined ? children : <ConfigView />}
    </ConfigsContext.Provider>
  );
};

export const useConfigs = () => useContext(ConfigsContext);
