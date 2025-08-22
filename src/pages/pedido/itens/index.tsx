import { GetServerSideProps, NextPage } from "next";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { ItensView } from "src/views/pedido/itens";
import { IPedido } from "tpdb-lib";

const ItensPage: NextPage = ({ pedido }: { pedido: IPedido }) => {
  return <ItensView pedido={pedido} />;
};

export default ItensPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx);

      if ("redirect" in verif) return verif;

      return {
        props: {
          ...verif.props,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        props: {
          pedido: null,
        },
      };
    }
  }
);
