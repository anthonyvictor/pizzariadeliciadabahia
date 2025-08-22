"use client";
import TextContainer from "@components/textContainer";
import { IBairro } from "tpdb-lib";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { RuaViewStyle } from "./styles";
import { enderecoPizzaria } from "@util/dados";
import Loading from "@components/loading";

const EnderecoAutocomplete = dynamic(
  () => {
    if (typeof window === "undefined" || !window)
      return Promise.resolve(() => null);
    return import("@components/EnderecoAutocomplete");
  },
  { ssr: false }
);

export const RuaView = ({ ipLoc }: { ipLoc: [number, number] | undefined }) => {
  const [geoLoc, setGeoLoc] = useState<[number, number]>();
  const [bairro, setBairro] = useState<IBairro>();
  const router = useRouter();

  const fixedLoc: [number, number] = [
    enderecoPizzaria.lat,
    enderecoPizzaria.lon,
  ];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _geoLoc = JSON.parse(sessionStorage.getItem("geoLoc") ?? "{}");

    if (_geoLoc?.[0] && _geoLoc?.[1]) {
      setGeoLoc(_geoLoc);
    }

    const _bairro = JSON.parse(sessionStorage.getItem("bairro") ?? "{}");
    if (!_bairro?.id) router.push("/cliente/novo-endereco");
    setBairro(_bairro);

    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <RuaViewStyle>
      <TextContainer
        title="Endereço"
        description="Pesquise seu endereço, ou arraste o pino no mapa até o local"
      />
      {!!bairro?.id && (
        <EnderecoAutocomplete
          bairro={bairro}
          posicaoLoja={fixedLoc}
          posicaoCliente={geoLoc ?? ipLoc}
        />
      )}
    </RuaViewStyle>
  );
};
