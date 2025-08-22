import { GetServerSideProps, NextPage } from "next";
import { IPedido } from "tpdb-lib";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { obterCupons } from "@routes/cupons";
import { analisarCodigoCupom } from "@util/cupons";
import { ConfirmacaoView } from "src/views/pedido/confirmacao";

const ConfirmacaoPage: NextPage = ({ pedido }: { pedido: IPedido }) => {
  return <ConfirmacaoView pedido={pedido} />;
};

export default ConfirmacaoPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx);

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
