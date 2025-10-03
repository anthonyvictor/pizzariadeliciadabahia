import { NextPage } from "next";
import { BebidasView } from "src/views/loja/app/produtos/bebidas";
import { BebidasProvider } from "src/views/loja/app/produtos/bebidas/context";

const BebidasPage: NextPage = () => {
  return (
    <BebidasProvider>
      <BebidasView />
    </BebidasProvider>
  );
};

export default BebidasPage;
