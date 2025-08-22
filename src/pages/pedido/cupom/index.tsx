import { GetServerSideProps, NextPage } from "next";
import { IPedido } from "tpdb-lib";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { CupomView } from "src/views/pedido/cupom";

const CupomPage: NextPage = ({ pedido }: { pedido: IPedido }) => {
  return <CupomView pedido={pedido} />;
};

export default CupomPage;

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
        redirect: {
          destination: "/pedido",
          permanent: false,
        },
      };
    }
  }
);
