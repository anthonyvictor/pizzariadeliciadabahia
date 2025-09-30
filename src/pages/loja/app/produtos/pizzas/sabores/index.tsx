import { NextPage } from "next";
import { SaboresView } from "src/views/loja/app/produtos/pizzas/sabores";
import { SaboresProvider } from "src/views/loja/app/produtos/pizzas/sabores/context";

const SaboresPage: NextPage = () => {
  return (
    <SaboresProvider>
      <SaboresView />
    </SaboresProvider>
  );
};

export default SaboresPage;
