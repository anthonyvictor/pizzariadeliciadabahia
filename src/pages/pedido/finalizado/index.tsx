import { IPedido } from "tpdb-lib";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { GetServerSideProps, NextPage } from "next";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { FinalizadoView } from "src/views/pedido/finalizado";

const FinaliadoPage: NextPage = ({ pedido }: { pedido: IPedido }) => {
  return <FinalizadoView pedido={pedido} />;
};

export default FinaliadoPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx, {
        comEnderecoCompleto: true,
      });

      if ("redirect" in verif) return verif;

      return {
        props: {
          pedido: verif.props.pedido,
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
