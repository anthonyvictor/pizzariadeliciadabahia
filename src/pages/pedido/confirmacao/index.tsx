import { GetServerSideProps, NextPage } from "next";
import { ConfirmacaoView } from "src/views/pedido/confirmacao";
import { ICookies } from "@models/cookies";
import { useAuth } from "@util/hooks/auth";
import { useEffect } from "react";
import Loading from "@components/loading";
import { obterCookies } from "@util/cookies";

const ConfirmacaoPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  if (!authCarregado) return <Loading />;

  return <ConfirmacaoView pedido={pedido} />;
};

export default ConfirmacaoPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
