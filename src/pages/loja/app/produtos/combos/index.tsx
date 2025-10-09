import { NextPage } from "next";
import { CombosView } from "src/views/loja/app/produtos/combos";
import { CombosProvider } from "src/views/loja/app/produtos/combos/context";

const CombosPage: NextPage = () => {
  return (
    <CombosProvider>
      <CombosView />
    </CombosProvider>
  );
};

export default CombosPage;
