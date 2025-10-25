import { NextPage } from "next";
import { ConfigsView } from "src/views/loja/app/configs";
import { ConfigsProvider } from "src/views/loja/app/configs/context";

const ConfigsPage: NextPage = () => {
  return (
    <ConfigsProvider>
      <ConfigsView />
    </ConfigsProvider>
  );
};

export default ConfigsPage;
