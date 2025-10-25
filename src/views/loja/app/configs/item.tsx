import { IConfig } from "tpdb-lib";
import { useConfigs } from "./context";
import { ConfigItemStyle } from "./styles";
// import { upsertArray } from "@util/state";
// import { salvar } from "../../util/func";
import { Descricao } from "src/views/loja/components/listas/descricao";

export const ConfigItem = ({ item }: { item: IConfig }) => {
  const { setEditando, setConfigs } = useConfigs();
  return (
    <ConfigItemStyle
      key={item.chave}
      className="config"
      item={item}
      onClick={() => setEditando(item.chave)}
    >
      <aside className="dir">
        <h5 className="nome">
          <span>{item.nome}</span>
          {/* <span style={{ marginRight: "5px" }}>•</span> */}
          {/* <span>{item.categoria ?? "s/Categ"}</span> */}
        </h5>

        <Descricao descricao={item.descricao} full />
      </aside>
    </ConfigItemStyle>
  );
};
