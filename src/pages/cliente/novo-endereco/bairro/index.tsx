import { GetServerSideProps, NextPage } from "next";
import { IBairro } from "tpdb-lib";
import { BairroView } from "src/views/cliente/novoEndereco/bairro";
import { env } from "@config/env";
import { obterBairros } from "@routes/bairros";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";

const BairroPage: NextPage = ({ bairros }: { bairros: IBairro[] }) => {
  return <BairroView bairros={bairros} />;
};

export default BairroPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx);

      if ("redirect" in verif) return verif;

      const bairros = await obterBairros();

      return {
        props: {
          ...verif.props,
          bairros,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        props: {
          bairros: null,
          pedido: null,
        },
      };
    }
  }
);
