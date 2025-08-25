import { NextPage } from "next";
import { PedidoPageProvider } from "src/views/pedido/inicio/context";
import { PedidoView } from "src/views/pedido/inicio";
import { useAuth } from "@util/hooks/auth";
import { useEffect } from "react";
import Loading from "@components/loading";

const PedidoPage: NextPage = () => {
  const { temClientePedido, authCarregado, pedido, fechado } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;
  if (fechado) return <div>Estamos fechados no momento</div>;

  return (
    <PedidoPageProvider pedido={pedido}>
      <PedidoView />
    </PedidoPageProvider>
  );
};

export default PedidoPage;
