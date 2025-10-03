import { NextPage } from "next";
import { LanchesView } from "src/views/loja/app/produtos/lanches";
import { LanchesProvider } from "src/views/loja/app/produtos/lanches/context";

const LanchesPage: NextPage = () => {
  return (
    <LanchesProvider>
      <LanchesView />
    </LanchesProvider>
  );
};

export default LanchesPage;
