import { GetServerSideProps, NextPage } from "next";
import { PixView } from "src/views/pedido/pagamento/pix";
import { obterCookies } from "@util/cookies";
import { ICookies } from "@models/cookies";
import { useAuth } from "@util/hooks/auth";
import { useEffect } from "react";
import Loading from "@components/loading";

const PixPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const { temClientePedido, authCarregado, pedido, pixAguardando } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  if (!authCarregado) return <Loading />;

  return <PixView pedido={pedido} pix={pixAguardando} />;
};

export default PixPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
