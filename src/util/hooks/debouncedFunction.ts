import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { IEndereco } from "tpdb-lib";
import axios from "axios";
import { env } from "@config/env";
import { axiosOk } from "@util/axios";

export function useEnderecoAutocomplete({
  bairro,
  defaultValue,
  defaultPosition,
}: {
  bairro: string;
  defaultValue?: string;
  defaultPosition?: [number, number];
}) {
  const [inputValue, setInputValue] = useState({
    value: defaultValue ?? "",
    showSuggestions: false,
  });
  const [suggestions, setSuggestions] = useState<IEndereco[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedFirstPosition, setLoadedFirstPosition] = useState(false);

  const sortByBairros = (arr: IEndereco[]) => {
    return arr.sort((a, b) =>
      a.bairro.toLowerCase().includes(bairro.toLowerCase()) ? -1 : 1
    );
  };

  const fetchEnderecosQuery = async (value: string) => {
    if (!value || value.length < 4) return [];
    setLoading(true);

    const res = await axios.get(`${env.apiURL}/enderecos/autocomplete`, {
      params: { query: value },
    });

    if (!axiosOk(res.status))
      console.error("Erro na pesquisa de endereços pela api");

    const enderecos = res.data as IEndereco[];
    setLoading(false);
    return sortByBairros(enderecos);
  };

  const fetchEnderecosPosicao = async (pos: [number, number]) => {
    setLoading(true);

    const res = await axios.get(`${env.apiURL}/enderecos/reverse`, {
      params: { lat: pos[0], lon: pos[1] },
    });

    if (!axiosOk(res.status))
      console.error("Erro na pesquisa de endereços pela api");

    const enderecos = res.data as IEndereco[];
    setLoading(false);

    return sortByBairros(enderecos);
  };

  const debouncedFetchRef = useRef(
    debounce((value: string) => {
      fetchEnderecosQuery(value).then((res) => {
        setSuggestions(res as IEndereco[]);
      });
    }, 600)
  );

  useEffect(() => {
    if (inputValue.showSuggestions && loadedFirstPosition)
      debouncedFetchRef.current(inputValue.value);
  }, [inputValue]);
  useEffect(() => {
    if (defaultPosition) {
      console.log("mudou default position");
      fetchEnderecosPosicao(defaultPosition).then((data) => {
        setLoadedFirstPosition(true);
        setSuggestions(data);
      });
    } else {
      setLoadedFirstPosition(true);
    }
  }, [defaultPosition]);

  return {
    inputValue,
    setInputValue,
    suggestions,
    setSuggestions,
    loading,
  };
}
