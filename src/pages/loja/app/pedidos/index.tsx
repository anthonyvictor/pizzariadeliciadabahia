import { NextPage } from "next";
import { PedidosView } from "src/views/loja/app/pedidos";
import { PedidosProvider } from "src/views/loja/app/pedidos/context";

const PedidosPage: NextPage = () => {
  return (
    <PedidosProvider>
      <PedidosView />
    </PedidosProvider>
  );
};

export default PedidosPage;
