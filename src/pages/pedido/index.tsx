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
  if (fechado)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "20px",
          textAlign: "center",
          flex: "1",
        }}
      >
        <h3 style={{ color: "#ffae00" }}>Estamos fechados no momento</h3>
        <small style={{ color: "#fff" }}>
          Fique de olho em nossas postagens no instagram e whatsapp!
        </small>
      </div>
    );

  return (
    <PedidoPageProvider pedido={pedido}>
      <PedidoView />
    </PedidoPageProvider>
  );
};

export default PedidoPage;
