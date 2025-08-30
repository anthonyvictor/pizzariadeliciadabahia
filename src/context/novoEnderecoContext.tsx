import { createContext, ReactNode, useContext, useState } from "react";

interface INovoEnderecoContext {}
const NovoEnderecoContext = createContext<INovoEnderecoContext>(
  {} as INovoEnderecoContext
);

export const NovoEnderecoProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NovoEnderecoContext.Provider value={{}}>
      {children}
    </NovoEnderecoContext.Provider>
  );
};

export const useNovoEndereco = () => useContext(NovoEnderecoContext);
