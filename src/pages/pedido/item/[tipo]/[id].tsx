import { GetServerSideProps, NextPage } from "next";
import { IItemBuilder } from "tpdb-lib";
import { ItemBuilderProvider } from "@context/itemContext";
import { ItemBuilderView } from "src/views/pedido/itemBuilder";
import { obterItemBuilder } from "@routes/pages/item-builder";
import { IItemPedidoTipo } from "tpdb-lib";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";

const ItemBuilderPage: NextPage = ({
  builder,
  pedidoId,
}: {
  builder: IItemBuilder | null;
  pedidoId: string;
}) => {
  return (
    <ItemBuilderProvider builder={builder} pedidoId={pedidoId}>
      <ItemBuilderView />
    </ItemBuilderProvider>
  );
};

export default ItemBuilderPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx);

      if ("redirect" in verif) return verif;

      const builder = await obterItemBuilder(
        ctx.query.id as string,
        ctx.query.tipo as IItemPedidoTipo | "combo",
        verif.props.cliente.id
      );

      return {
        props: {
          pedidoId: verif.props.pedido.id,
          builder,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: {
          destination: "/pedido",
          permanent: false,
        },
      };
    }
  }
);
