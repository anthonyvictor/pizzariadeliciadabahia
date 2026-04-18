import { NextPage } from "next";
import { TamanhosView } from "src/views/loja/app/produtos/pizzas/tamanhos";
import { TamanhosProvider } from "src/views/loja/app/produtos/pizzas/tamanhos/context";

const TamanhosPage: NextPage = () => {
  // return <>fodaseeeeee</>;
  return (
    <TamanhosProvider>
      {/* <p>fodaseeeeeeeeeeeeeeeeeeeeeeee</p> */}
      <TamanhosView />
    </TamanhosProvider>
  );
};

export default TamanhosPage;
