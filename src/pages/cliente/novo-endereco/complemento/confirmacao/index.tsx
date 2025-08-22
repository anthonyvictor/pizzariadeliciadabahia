import { ICliente } from "tpdb-lib";
import { verificarClienteEPedido } from "@util/verificarClienteEPedido";
import { GetServerSideProps, NextPage } from "next";
import { withSuperjsonGSSP } from "src/infra/superjson";
import { ConfirmacaoComplementoView } from "src/views/cliente/novoEndereco/complemento/confirmacao";

const ConfirmacaoComplementoPage: NextPage = ({
  cliente,
}: {
  cliente: ICliente;
}) => {
  return <ConfirmacaoComplementoView cliente={cliente} />;
};

export default ConfirmacaoComplementoPage;

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async (ctx) => {
    try {
      const verif = await verificarClienteEPedido(ctx);

      if ("redirect" in verif) return verif;

      return {
        props: {
          ...verif.props,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        props: {
          cliente: null,
        },
      };
    }
  }
);
