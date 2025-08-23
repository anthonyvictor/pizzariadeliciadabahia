import { GetServerSideProps, NextPage } from "next";
import { CupomView } from "src/views/pedido/cupom";
import { obterCookies } from "@util/cookies";
import { ICookies } from "@models/cookies";
import { useEffect } from "react";
import Loading from "@components/loading";
import { useAuth } from "@util/hooks/auth";

const CupomPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  if (!authCarregado) return <Loading />;

  return <CupomView pedido={pedido} />;
};

export default CupomPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
