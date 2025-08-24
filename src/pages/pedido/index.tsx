import { GetServerSideProps, NextPage } from "next";
import { ICookies } from "@models/cookies";
import { obterCookies } from "@util/cookies";
import { PedidoPageProvider } from "src/views/pedido/inicio/context";
import { PedidoView } from "src/views/pedido/inicio";

const PedidoPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  return (
    <PedidoPageProvider clienteId={clienteId} pedidoId={pedidoId}>
      <PedidoView />
    </PedidoPageProvider>
  );
};

export default PedidoPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
