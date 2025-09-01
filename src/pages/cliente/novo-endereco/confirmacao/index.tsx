import { NextPage } from "next";
import { ConfirmacaoComplementoView } from "src/views/cliente/novoEndereco/confirmacao";
import { useEffect } from "react";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import { useClienteStore } from "src/infra/zustand/cliente";

const ConfirmacaoComplementoPage: NextPage = () => {
  const { temClientePedido, authCarregado } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <ConfirmacaoComplementoView />;
};

export default ConfirmacaoComplementoPage;
