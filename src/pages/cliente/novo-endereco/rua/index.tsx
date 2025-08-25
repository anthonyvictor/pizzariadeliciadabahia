import Loading from "@components/loading";
import { IAuth } from "@models/auth";
import { useAuth } from "@util/hooks/auth";
import { obterLocalizacaoPeloIp } from "@util/obterLocalizacaoPeloIp";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { RuaView } from "src/views/cliente/novoEndereco/rua";

const RuaPage: NextPage = ({
  ipLoc,
}: { ipLoc: [number, number] | null } & IAuth) => {
  const { temClientePedido, authCarregado } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;
  return <RuaView ipLoc={ipLoc} />;
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
