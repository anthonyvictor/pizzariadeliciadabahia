import { NextPage } from "next";
import { ConfirmacaoView } from "src/views/pedido/confirmacao";
import { useAuth } from "@util/hooks/auth";
import { useEffect } from "react";
import Loading from "@components/loading";

const ConfirmacaoPage: NextPage = () => {
  const { authCarregado } = useAuth();

  if (!authCarregado) return <Loading />;

  return <ConfirmacaoView />;
};

export default ConfirmacaoPage;
