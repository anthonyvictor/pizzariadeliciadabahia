import { GetServerSideProps, NextPage } from "next";
import { ConfirmacaoComplementoView } from "src/views/cliente/novoEndereco/complemento/confirmacao";
import { useEffect } from "react";
import { ICookies } from "@models/cookies";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import { obterCookies } from "@util/cookies";

const ConfirmacaoComplementoPage: NextPage = ({
  clienteId,
  pedidoId,
}: ICookies) => {
  const { temClientePedido, authCarregado, cliente } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  if (!authCarregado) return <Loading />;

  return <ConfirmacaoComplementoView cliente={cliente} />;
};

export default ConfirmacaoComplementoPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
