import { SetState } from "@config/react";
import { enderecoPizzaria } from "@util/dados";
import { useEnderecoAutocomplete } from "@util/hooks/debouncedFunction";
import { createContext, ReactNode, useContext, useState } from "react";
import { IBairro, IEndereco } from "tpdb-lib";

interface ITipoPageContext {
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

const TipoPageContext = createContext<ITipoPageContext>({} as ITipoPageContext);

export const TipoPageProvider = ({
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

  //   if (loading) return <Loading />;
  return (
    <TipoPageContext.Provider
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
    </TipoPageContext.Provider>
  );
};

export const useTipoPage = () => {
  return useContext(TipoPageContext);
};
