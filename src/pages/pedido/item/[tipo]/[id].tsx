import { GetServerSideProps, NextPage } from "next";
import { IItemBuilder } from "tpdb-lib";
import { ItemBuilderProvider } from "@context/itemContext";
import { ItemBuilderView } from "src/views/pedido/itemBuilder";
import { obterCookies } from "@util/cookies";
import { useAuth } from "@util/hooks/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "@config/env";
import { toast } from "react-toastify";
import { ICookies } from "@models/cookies";
import Loading from "@components/loading";

const ItemBuilderPage: NextPage = ({
  clienteId,
  pedidoId,
  id,
  tipo,
}: { id: string; tipo: string } & ICookies) => {
  const [builder, setBuilder] = useState<IItemBuilder>();
  const { temClientePedido, authCarregado } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(
          `${env.apiURL}/pages/item-builder?id=${id}&clienteId=${clienteId}&tipo=${tipo}`
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
    <ItemBuilderProvider builder={builder} pedidoId={pedidoId}>
      <ItemBuilderView />
    </ItemBuilderProvider>
  );
};

export default ItemBuilderPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
      tipo: ctx.query.tipo,
      id: ctx.query.id,
    },
  };
};
