import { GetServerSideProps, NextPage } from "next";
import { NovoEnderecoProvider } from "@context/novoEnderecoContext";
import { NovoEnderecoView } from "src/views/cliente/novoEndereco";
import { withSuperjsonGSSP } from "src/infra/superjson";

const NovoEndereco: NextPage = () => {
  return (
    <NovoEnderecoProvider>
      <NovoEnderecoView />
    </NovoEnderecoProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withSuperjsonGSSP(
  async () => {
    return {
      redirect: {
        destination: "/cliente/novo-endereco/bairro",
        permanent: false,
      },
    };
  }
);

export default NovoEndereco;
