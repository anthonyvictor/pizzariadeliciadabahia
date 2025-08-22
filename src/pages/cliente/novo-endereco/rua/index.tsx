import { obterLocalizacaoPeloIp } from "@util/obterLocalizacaoPeloIp";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { GetServerSideProps, NextPage } from "next";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { RuaView } from "src/views/cliente/novoEndereco/rua";

const RuaPage: NextPage = ({ ipLoc }: { ipLoc: [number, number] | null }) => {
  return <RuaView ipLoc={ipLoc} />;
};

export default RuaPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx);

      if ("redirect" in verif) return verif;

      const ipLoc = await obterLocalizacaoPeloIp(ctx);

      return {
        props: {
          ...verif.props,
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
  }
);
