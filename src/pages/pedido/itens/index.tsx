import { NextPage } from "next";
import { ItensView } from "src/views/pedido/itens";
import Loading from "@components/loading";
import { useEffect } from "react";
import { useAuth } from "@util/hooks/auth";

const ItensPage: NextPage = () => {
  const { temClientePedido, authCarregado } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <ItensView />;
};

export default ItensPage;
