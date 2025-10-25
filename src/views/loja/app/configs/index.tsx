import TextContainer from "@components/textContainer";
import { ConfigsList, ConfigsViewStyle } from "./styles";
import { useConfigs } from "./context";
import { FloatButton } from "@styles/components/buttons";
import { useState } from "react";
import { Search } from "src/views/loja/components/listas/search";
import { fuzzySearch } from "@util/array";
import { ConfigItem } from "./item";

export const ConfigsView = () => {
  const { configs, setEditando } = useConfigs();
  const [search, setSearch] = useState("");
  const filtrados = configs?.length
    ? fuzzySearch(configs, search, [
        { field: "nome", weight: 10 },
        { field: "descricao", weight: 5 },
      ])
    : [];

  return (
    <ConfigsViewStyle>
      <TextContainer title="Configs" />
      <Search value={search} setValue={setSearch} />
      <ConfigsList className="configs">
        {filtrados.map((item) => (
          <ConfigItem key={item.chave} item={item} />
        ))}
      </ConfigsList>
      {/* <Footer itens={configs} filtrados={filtrados} /> */}
      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
    </ConfigsViewStyle>
  );
};
