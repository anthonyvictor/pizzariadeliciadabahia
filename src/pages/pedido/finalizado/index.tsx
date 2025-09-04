import { NextPage } from "next";
import { FinalizadoView } from "src/views/pedido/finalizado";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";

const FinalizadoPage: NextPage = () => {
  const { authCarregado } = useAuth({
    verificarPixAguardando: false,
  });

  if (!authCarregado) return <Loading />;

  return <FinalizadoView />;
};

export default FinalizadoPage;
