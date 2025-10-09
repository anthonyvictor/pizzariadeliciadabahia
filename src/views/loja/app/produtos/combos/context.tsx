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
import { ICombo } from "tpdb-lib";
import { ComboView } from "./editor";

type IFiltro = {
  tipo: "visivel" | "disponivel" | "somenteEmCombos";
  valor: boolean;
};
type ICombosContext = {
  combos: ICombo[];
  setCombos: SetState<ICombo[]>;
  editando: undefined | string;
  setEditando: SetState<undefined | string>;
  search: string;
  setSearch: SetState<string>;
  statsFiltro: IFiltro[];
  setStatsFiltro: SetState<IFiltro[]>;
};
const CombosContext = createContext<ICombosContext>({} as ICombosContext);

export const CombosProvider = ({ children }: { children: ReactNode }) => {
  const [combos, setCombos] = useState<ICombo[]>([]);
  const [editando, setEditando] = useState<undefined | string>();
  const [search, setSearch] = useState("");
  const [statsFiltro, setStatsFiltro] = useState<IFiltro[]>([]);
  useEffect(() => {
    api
      .get("/combos", {
        params: {
          deveEstar: 0,
        },
      })
      .then((res) => {
        if (res?.data?.length) setCombos(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  return (
    <CombosContext.Provider
      value={{
        combos,
        setCombos,
        editando,
        setEditando,
        search,
        setSearch,
        statsFiltro,
        setStatsFiltro,
      }}
    >
      {editando === undefined ? children : <ComboView />}
    </CombosContext.Provider>
  );
};

export const useCombos = () => useContext(CombosContext);
