import { NextPage } from "next";
import { IItemBuilder, IPedido } from "tpdb-lib";
import { ItemBuilderProvider } from "@context/itemContext";
import { ItemBuilderView } from "src/views/pedido/itemBuilder";
import { useAuth } from "@util/hooks/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "@config/env";
import { toast } from "react-toastify";
import Loading from "@components/loading";
import { useRouter } from "next/router";
import { usePedidoStore } from "src/infra/zustand/pedido";

const ItemBuilderPage: NextPage = () => {
  const [builder, setBuilder] = useState<IItemBuilder>();
  const { temClientePedido, authCarregado } = useAuth();
  const router = useRouter();
  const { pedido } = usePedidoStore();
  useEffect(() => {
    temClientePedido();
  }, []);

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(
          `${env.apiURL}/pages/item-builder?id=${router.query.id}&clienteId=${pedido.cliente.id}&tipo=${router.query.tipo}`
        )
        .then((res) => {
          setBuilder(res.data);
        })
        .catch((err) => {
          toast.error("Erro ao carregar dados");
          console.error(err);
        });
    }
  }, [authCarregado]);

  if (!authCarregado || !builder) return <Loading />;

  return (
    <ItemBuilderProvider builder={builder}>
      <ItemBuilderView />
    </ItemBuilderProvider>
  );
};

export default ItemBuilderPage;
