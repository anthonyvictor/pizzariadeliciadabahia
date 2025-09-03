import { NextPage } from "next";
import { PedidoPageProvider } from "src/views/pedido/inicio/context";
import { PedidoView } from "src/views/pedido/inicio";
import { useAuth } from "@util/hooks/auth";
import { useEffect } from "react";
import Loading from "@components/loading";

const PedidoPage: NextPage = () => {
  const { temClientePedido, authCarregado } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return (
    <PedidoPageProvider>
      <PedidoView />
    </PedidoPageProvider>
  );
};

export default PedidoPage;
