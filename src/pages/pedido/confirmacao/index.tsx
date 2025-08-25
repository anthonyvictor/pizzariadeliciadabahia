import { NextPage } from "next";
import { ConfirmacaoView } from "src/views/pedido/confirmacao";
import { useAuth } from "@util/hooks/auth";
import { useEffect } from "react";
import Loading from "@components/loading";

const ConfirmacaoPage: NextPage = () => {
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <ConfirmacaoView pedido={pedido} />;
};

export default ConfirmacaoPage;
