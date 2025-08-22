import { GetServerSideProps, NextPage } from "next";
import { PagamentoView } from "src/views/pedido/pagamento";
import { IPedido } from "tpdb-lib";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { obterCupons } from "@routes/cupons";
import { ICupom } from "tpdb-lib";
import { analisarCodigoCupom } from "@util/cupons";

const PagamentoPage: NextPage = ({
  pedido,
  cupomPagamento,
}: {
  pedido: IPedido;
  cupomPagamento: ICupom;
}) => {
  return <PagamentoView pedido={pedido} cupomPagamento={cupomPagamento} />;
};

export default PagamentoPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx);

      if ("redirect" in verif) return verif;

      const a = await obterCupons({ _cliente: verif.props.cliente });
      const b = a.filter(
        (cupom) => cupom.alvo === "pagamento" || cupom.alvo === "itens"
      );
      const c = b.filter((cupom) =>
        analisarCodigoCupom(cupom, verif.props.pedido.codigoCupom)
      );
      const d = c.sort((a, b) =>
        a.condicoes.some((x) => x.tipo === "codigo") ? -1 : 1
      );

      const cupomPagamento = d?.[0] ?? null;

      return {
        props: {
          pedido: verif.props.pedido,
          cupomPagamento,
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
