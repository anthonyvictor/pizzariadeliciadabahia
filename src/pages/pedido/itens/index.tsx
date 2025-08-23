import { GetServerSideProps, NextPage } from "next";
import { ItensView } from "src/views/pedido/itens";
import { ICookies } from "@models/cookies";
import { obterCookies } from "@util/cookies";
import Loading from "@components/loading";
import { useEffect } from "react";
import { useAuth } from "@util/hooks/auth";

const ItensPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  if (!authCarregado) return <Loading />;

  return <ItensView pedido={pedido} />;
};

export default ItensPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
