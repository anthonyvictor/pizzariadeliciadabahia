import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { IEndereco } from "tpdb-lib";
import axios from "axios";
import { env } from "@config/env";
import { axiosOk } from "@util/axios";

export function useEnderecoAutocomplete({
  bairro,
  textoPadrao,
  posicaoPadrao,
}: {
  bairro: string;
  textoPadrao?: string;
  posicaoPadrao?: [number, number];
}) {
  const [pesqEnderecos, setPesqEnderecos] = useState(textoPadrao ?? "");
  const [posMapa, setPosMapa] = useState(posicaoPadrao);
  const [enderecos, setEnderecos] = useState<IEndereco[]>([]);
  const [enderecoSel, setEnderecoSel] = useState<IEndereco>();
  const [carregEnderecos, setCarregEnderecos] = useState(false);

  useEffect(() => {
    if (posMapa) {
      fetchEnderecosPosicao(posMapa).then((data) => {
        setEnderecos(data);
      });
    }
  }, []);

  const sortByBairros = (arr: IEndereco[]) => {
    return arr.sort((a, b) =>
      a.bairro.toLowerCase().includes(bairro.toLowerCase()) ? -1 : 1
    );
  };

  const fetchEnderecosQuery = async (value: string) => {
    if (!value || value.length < 4) return [];
    setCarregEnderecos(true);

    const res = await axios.get(`${env.apiURL}/enderecos/autocomplete`, {
      params: { rua: value, bairro },
    });

    if (!axiosOk(res.status))
      console.error("Erro na pesquisa de endereços pela api");

    const enderecos = res.data as IEndereco[];
    setCarregEnderecos(false);
    return sortByBairros(enderecos);
  };

  const fetchEnderecosPosicao = async (pos: [number, number]) => {
    setCarregEnderecos(true);

    const sugestoesSalvas = JSON.parse(
      sessionStorage.getItem("sugestoes-posicao") ?? "{}"
    ) as { key: string; sugestoes: IEndereco[] };

    if (sugestoesSalvas?.key === pos.toString()) {
      setCarregEnderecos(false);
      return sugestoesSalvas.sugestoes;
    }

    const res = await axios.get(`${env.apiURL}/enderecos/reverse`, {
      params: { lat: pos[0], lon: pos[1] },
    });

    if (!axiosOk(res.status))
      console.error("Erro na pesquisa de endereços pela api");

    const enderecos = res.data as IEndereco[];

    sessionStorage.setItem(
      "sugestoes-posicao",
      JSON.stringify({ key: pos.toString(), sugestoes: enderecos })
    );
    setCarregEnderecos(false);

    return enderecos;
  };

  const debouncedFetchRef = useRef(
    debounce((value: string) => {
      fetchEnderecosQuery(value).then((res) => {
        setEnderecos(res as IEndereco[]);
      });
    }, 600)
  );

  const eventoArrastar = (lat: number, lon: number) => {
    setPosMapa([lat, lon]);

    fetchEnderecosPosicao(posMapa).then((data) => {
      setEnderecos(data);
    });
  };

  const eventoPesq = (val: string) => {
    setPesqEnderecos(val);

    debouncedFetchRef.current(val);
  };

  return {
    pesqEnderecos,
    setPesqEnderecos,
    enderecos,
    setEnderecos,
    carregEnderecos,
    posMapa,
    setPosMapa,
    enderecoSel,
    setEnderecoSel,
    eventoArrastar,
    eventoPesq,
  };
}
