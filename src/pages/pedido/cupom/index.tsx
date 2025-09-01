import { NextPage } from "next";
import { CupomView } from "src/views/pedido/cupom";
import { useEffect } from "react";
import Loading from "@components/loading";
import { useAuth } from "@util/hooks/auth";
import { usePedidoStore } from "src/infra/zustand/pedido";

const CupomPage: NextPage = () => {
  const { temClientePedido, authCarregado } = useAuth();
  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <CupomView />;
};

export default CupomPage;
