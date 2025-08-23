import Loading from "@components/loading";
import { ICookies } from "@models/cookies";
import { obterCookies } from "@util/cookies";
import { useAuth } from "@util/hooks/auth";
import { obterLocalizacaoPeloIp } from "@util/obterLocalizacaoPeloIp";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { RuaView } from "src/views/cliente/novoEndereco/rua";

const RuaPage: NextPage = ({
  ipLoc,
  clienteId,
  pedidoId,
}: { ipLoc: [number, number] | null } & ICookies) => {
  const { temClientePedido, authCarregado } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  if (!authCarregado) return <Loading />;
  return <RuaView ipLoc={ipLoc} />;
};

export default RuaPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { clienteId, pedidoId } = obterCookies(ctx);

    const ipLoc = await obterLocalizacaoPeloIp(ctx);

    return {
      props: {
        ipLoc,
        clienteId,
        pedidoId,
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
