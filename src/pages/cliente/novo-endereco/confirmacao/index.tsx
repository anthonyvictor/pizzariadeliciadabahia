import { NextPage } from "next";
import { ConfirmacaoComplementoView } from "src/views/cliente/novoEndereco/confirmacao";
import { useEffect } from "react";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";

const ConfirmacaoComplementoPage: NextPage = () => {
  const { temClientePedido, authCarregado, cliente } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <ConfirmacaoComplementoView cliente={cliente} />;
};

export default ConfirmacaoComplementoPage;
