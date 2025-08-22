import { GetServerSideProps, NextPage } from "next";
import { IPagamentoPedidoPix, IPedido } from "tpdb-lib";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { PixView } from "src/views/pedido/pagamento/pix";

const PixPage: NextPage = ({
  pedido,
  pix,
}: {
  pedido: IPedido;
  pix: IPagamentoPedidoPix | null;
}) => {
  return <PixView pedido={pedido} pix={pix} />;
};

export default PixPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx, {
        verificarPixAguardando: true,
      });

      if ("redirect" in verif) return verif;

      return {
        props: {
          pedido: verif.props.pedido,
          pix: verif.props.pix ?? null,
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
