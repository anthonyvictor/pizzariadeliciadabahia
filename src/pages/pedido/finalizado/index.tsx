import { GetServerSideProps, NextPage } from "next";
import { FinalizadoView } from "src/views/pedido/finalizado";
import { obterCookies } from "@util/cookies";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import { useEffect } from "react";
import { ICookies } from "@models/cookies";

const FinaliadoPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId, {
      comEnderecoCompleto: true,
    });
  }, []);

  if (!authCarregado) return <Loading />;

  return <FinalizadoView pedido={pedido} />;
};

export default FinaliadoPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
