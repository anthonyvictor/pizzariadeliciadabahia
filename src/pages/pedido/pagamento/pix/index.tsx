import { NextPage } from "next";
import { PixView } from "src/views/pedido/pagamento/pix";
import { useAuth } from "@util/hooks/auth";
import { useEffect } from "react";
import Loading from "@components/loading";

const PixPage: NextPage = () => {
  const { temClientePedido, authCarregado, pedido, pixAguardando } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <PixView pedido={pedido} pix={pixAguardando} />;
};

export default PixPage;
