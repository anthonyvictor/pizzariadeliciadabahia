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
  const [inputValue, setInputValue] = useState(defaultValue ?? "");
  const [position, setPosition] = useState<[number, number]>(defaultPosition);
  const [suggestions, setSuggestions] = useState<IEndereco[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<IEndereco>();

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

  // useEffect(() => {
  //   if (inputValue.showSuggestions && loadedFirstPosition)
  //     debouncedFetchRef.current(inputValue.value);
  // }, [inputValue]);

  // useEffect(() => {
  //   if (position) {
  //     console.log("mudou position");
  //     fetchEnderecosPosicao(position).then((data) => {
  //       setLoadedFirstPosition(true);
  //       setSuggestions(data);
  //     });
  //   } else {
  //     setLoadedFirstPosition(true);
  //   }
  // }, [position]);

  // useEffect(() => {
  //   if (selectedSuggestion) {
  //     fetchEnderecosPosicao(position).then((data) => {
  //       setLoadedFirstPosition(true);
  //       setSuggestions(data);
  //     });
  //   } else {
  //     setLoadedFirstPosition(true);
  //   }
  // }, [selectedSuggestion]);

  const handleDragEnd = (lat: number, lon: number) => {
    setPosition([lat, lon]);

    fetchEnderecosPosicao(position).then((data) => {
      setSuggestions(data);
    });
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);

    debouncedFetchRef.current(val);
  };

  // const handleSuggestionClick = (s: {lat: number, lon: number, name: string}) => {
  //   updateSource.current = "suggestion";
  //   setInputValue(s.name);
  //   setPosition([s.lat, s.lon]);
  //   setSuggestions([]);
  // };

  //   useEffect(() => {
  //   if (!position) return;
  //   const [lat, lon] = position;

  //   axios
  //     .get(
  //       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  //     )
  //     .then((res) => {
  //       if (res?.data?.address?.postcode) {
  //         const rua = res?.data?.address?.road;
  //         if (rua) setHiddenInput({ value: rua, showSuggestions: true });
  //       }
  //     });
  // }, [position]);

  return {
    inputValue,
    setInputValue,
    suggestions,
    setSuggestions,
    loading,
    position,
    setPosition,
    selectedSuggestion,
    setSelectedSuggestion,
    handleDragEnd,
    handleInputChange,
  };
}
