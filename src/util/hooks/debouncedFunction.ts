import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import axios from "axios";

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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedFirstPosition, setLoadedFirstPosition] = useState(false);

  const fetchEnderecosQuery = async (value: string) => {
    if (!value || value.length < 4) return [];
    setLoading(true);
    const query = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      value + ` ${bairro}`
    )}&bbox=-38.573,-13.071,-38.327,-12.809&limit=5&lang=en&layer=street`;
    console.log("viadddddooooo");
    console.time(`Photon Query ${value}`);
    const res = await axios.get(query);
    console.timeEnd(`Photon Query ${value}`);
    const data = res.data;
    console.log("viadddddooooo");
    console.log(res.data);

    setLoading(false);
    return data.features || [];
  };

  const fetchEnderecosPosicao = async (pos: [number, number]) => {
    const query = `https://photon.komoot.io/reverse?lat=${pos[0]}&lon=${pos[1]}&limit=5`;
    console.time(`Photon Position ${pos}`);
    const res = await axios.get(query);
    console.timeEnd(`Photon Position ${pos}`);
    const data = await res.data;
    return data.features || [];
  };

  const debouncedFetchRef = useRef(
    debounce((value: string) => {
      fetchEnderecosQuery(value).then((res) => {
        setSuggestions(res);
      });
    }, 600)
  );

  useEffect(() => {
    if (inputValue.showSuggestions && loadedFirstPosition)
      debouncedFetchRef.current(inputValue.value);
  }, [inputValue]);

  useEffect(() => {
    if (defaultPosition) {
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
