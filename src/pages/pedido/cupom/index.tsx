import { NextPage } from "next";
import { CupomView } from "src/views/pedido/cupom";
import { useEffect } from "react";
import Loading from "@components/loading";
import { useAuth } from "@util/hooks/auth";

const CupomPage: NextPage = () => {
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <CupomView pedido={pedido} />;
};

export default CupomPage;
