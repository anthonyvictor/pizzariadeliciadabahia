import Loading from "@components/loading";
import { env } from "@config/env";
import { SetState } from "@config/react";
import { IAuth } from "@models/auth";
import { enderecoPizzaria } from "@util/dados";
import { useAuth } from "@util/hooks/auth";
import { useEnderecoAutocomplete } from "@util/hooks/debouncedFunction";
import axios from "axios";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { IBairro, IEndereco } from "tpdb-lib";

interface IRuaPageContext {
  carregEnderecos: boolean;
  enderecoSel: IEndereco;
  enderecos: IEndereco[];
  pesqEnderecos: string;
  posMapa: [number, number];
  eventoArrastar: (lat: number, lon: number) => void;
  eventoPesq: (val: string) => void;
  expandirLista: boolean;
  setExpandLista: SetState<boolean>;
}

const RuaPageContext = createContext<IRuaPageContext>({} as IRuaPageContext);

export const RuaPageProvider = ({
  ipLoc,
  geoLoc,
  bairro,
  children,
}: {
  ipLoc: [number, number] | undefined;
  geoLoc: [number, number];
  bairro: IBairro;
  children: ReactNode;
}) => {
  const [expandirLista, setExpandLista] = useState(false);

  const storeLoc: [number, number] = [
    enderecoPizzaria.lat,
    enderecoPizzaria.lon,
  ];

  const {
    carregEnderecos,
    enderecoSel,
    enderecos: _enderecos,
    pesqEnderecos,
    posMapa,
    eventoArrastar,
    eventoPesq,
  } = useEnderecoAutocomplete({
    bairro: bairro.nome,
    posicaoPadrao: geoLoc ?? ipLoc ?? storeLoc,
  });

  const enderecos = _enderecos.filter(
    (item, index, self) => index === self.findIndex((e) => e.rua === item.rua)
  );

  useEffect(() => {
    console.log({ t: "todos", _enderecos });
    console.log({ t: "filtrados", enderecos });
  }, [_enderecos]);

  //   if (loading) return <Loading />;
  return (
    <RuaPageContext.Provider
      value={{
        carregEnderecos,
        enderecoSel,
        enderecos,
        pesqEnderecos,
        posMapa,
        eventoArrastar,
        eventoPesq,
        expandirLista,
        setExpandLista,
      }}
    >
      {children}
    </RuaPageContext.Provider>
  );
};

export const useRuaPage = () => {
  return useContext(RuaPageContext);
};
