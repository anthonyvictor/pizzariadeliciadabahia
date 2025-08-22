import { SetState } from "@config/react";
import { createContext, ReactNode, useContext, useState } from "react";
import { IEndereco } from "tpdb-lib";

interface INovoEnderecoContext {
  endereco: IEndereco;
  setEndereco: SetState<IEndereco>;
}
const NovoEnderecoContext = createContext<INovoEnderecoContext>(
  {} as INovoEnderecoContext
);

export const NovoEnderecoProvider = ({ children }: { children: ReactNode }) => {
  const [endereco, setEndereco] = useState<IEndereco>({
    cep: "",
    bairroId: "",
    local: "",
    numero: "",
    referencia: "",
  } as unknown as IEndereco);

  return (
    <NovoEnderecoContext.Provider
      value={{
        endereco,
        setEndereco,
      }}
    >
      {children}
    </NovoEnderecoContext.Provider>
  );
};

export const useNovoEndereco = () => useContext(NovoEnderecoContext);
