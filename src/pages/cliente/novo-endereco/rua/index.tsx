import Loading from "@components/loading";
import { IAuth } from "@models/auth";
import { useAuth } from "@util/hooks/auth";
import { obterLocalizacaoPeloIp } from "@util/obterLocalizacaoPeloIp";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RuaView } from "src/views/cliente/novoEndereco/rua";
import { RuaPageProvider } from "src/views/cliente/novoEndereco/rua/context";
import { IBairro } from "tpdb-lib";

const RuaPage: NextPage = ({
  ipLoc,
}: { ipLoc: [number, number] | null } & IAuth) => {
  const { authCarregado } = useAuth();
  const router = useRouter();

  const [geoLoc, setGeoLoc] = useState<[number, number]>();
  const [bairro, setBairro] = useState<IBairro>();

  useEffect(() => {
    const _geoLoc = JSON.parse(sessionStorage.getItem("geoLoc") ?? "{}");

    if (_geoLoc?.[0] && _geoLoc?.[1]) {
      setGeoLoc(_geoLoc);
    }

    const _bairro = JSON.parse(sessionStorage.getItem("bairro") ?? "{}");
    if (!_bairro?.id) router.push("/cliente/novo-endereco");
    setBairro(_bairro);
  }, []);

  if (!authCarregado || !bairro) return <Loading />;
  return (
    <RuaPageProvider ipLoc={ipLoc} geoLoc={geoLoc} bairro={bairro}>
      <RuaView />
    </RuaPageProvider>
  );
};

export default RuaPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const ipLoc = await obterLocalizacaoPeloIp(ctx);

    return {
      props: {
        ipLoc,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        ipLoc: null,
      },
    };
  }
};
