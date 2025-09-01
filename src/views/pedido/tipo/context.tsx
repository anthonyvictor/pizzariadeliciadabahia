import { SetState } from "@config/react";
import { createContext, ReactNode, useContext, useState } from "react";
import { ICupom, IPedido } from "tpdb-lib";
import { Tipo } from "./types";

interface ITipoPageContext {
  tipo: Tipo;
  setTipo: SetState<Tipo>;
  cupomEntrega: ICupom | null;
}

const TipoPageContext = createContext<ITipoPageContext>({} as ITipoPageContext);

export const TipoPageProvider = ({
  cupomEntrega,
  children,
}: {
  cupomEntrega: ICupom | null;
  children: ReactNode;
}) => {
  const [tipo, setTipo] = useState<Tipo>();

  return (
    <TipoPageContext.Provider
      value={{
        tipo,
        setTipo,
        cupomEntrega,
      }}
    >
      {children}
    </TipoPageContext.Provider>
  );
};

export const useTipoPage = () => {
  return useContext(TipoPageContext);
};
