import { NextPage } from "next";
import { IItemBuilder } from "tpdb-lib";
import { ItemBuilderProvider } from "src/views/pedido/itemBuilder/context";
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
  const { authCarregado, aberto } = useAuth();
  const router = useRouter();
  const { pedido } = usePedidoStore();

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(
          `${env.apiURL}/pages/item-builder?id=${router.query.id}&pedidoId=${pedido.id}&tipo=${router.query.tipo}`
        )
        .then((res) => {
          console.log(res.data);
          setBuilder(res.data);
        })
        .catch((err) => {
          toast.error("Oops, esse produto não está disponível no momento!");
          router.back();
          console.error(err);
        });
    }
  }, [authCarregado]);

  if (!authCarregado || !builder) return <Loading />;

  return (
    <ItemBuilderProvider builder={builder} aberto={aberto}>
      <ItemBuilderView />
    </ItemBuilderProvider>
  );
};

export default ItemBuilderPage;
