import { NextPage } from "next";
import { FinalizadoView } from "src/views/pedido/finalizado";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import { useEffect } from "react";

const FinaliadoPage: NextPage = () => {
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido({
      comEnderecoCompleto: true,
      verificarPixAguardando: false,
    });
  }, []);

  if (!authCarregado) return <Loading />;

  return <FinalizadoView pedido={pedido} />;
};

export default FinaliadoPage;
