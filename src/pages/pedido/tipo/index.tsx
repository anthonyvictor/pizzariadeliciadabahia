import { ICliente } from "tpdb-lib";
import { IPedido } from "tpdb-lib";
import { ICupom } from "tpdb-lib";
import { obterCupons } from "@routes/cupons";
import { analisarCodigoCupom } from "@util/cupons";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { GetServerSideProps, NextPage } from "next";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { TipoView } from "src/views/pedido/tipo";

const TipoPage: NextPage = ({
  cliente,
  pedido,
  cupomEntrega,
}: {
  cliente: ICliente;
  pedido: IPedido;
  cupomEntrega: ICupom;
}) => {
  return (
    <TipoView cliente={cliente} pedido={pedido} cupomEntrega={cupomEntrega} />
  );
};

export default TipoPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx, {
        comEnderecoCompleto: true,
      });

      if ("redirect" in verif) return verif;

      const a = await obterCupons({ _cliente: verif.props.cliente });
      const b = a.filter((cupom) => cupom.alvo === "entrega");
      const c = b.filter((cupom) =>
        analisarCodigoCupom(cupom, verif.props.pedido.codigoCupom)
      );
      const d = c.sort((a, b) =>
        a.condicoes.some((x) => x.tipo === "codigo") ? -1 : 1
      );

      const cupomEntrega = d?.[0] ?? null;

      return {
        props: {
          cliente: verif.props.cliente,
          pedido: verif.props.pedido,
          cupomEntrega,
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
