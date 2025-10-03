import { ILanche } from "tpdb-lib";
import { useLanches } from "./context";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { formatCurrency } from "@util/format";
import { LancheItemStyle } from "./styles";
import { salvar } from "../../util/func";
import { NumberInput } from "@components/NumberInput";
import { Estoque } from "src/views/loja/components/listas/estoque";
import { upsertArray } from "@util/state";
import { Descricao } from "src/views/loja/components/listas/descricao";

export const LancheItem = ({ item }: { item: ILanche }) => {
  const { setEditando, setLanches } = useLanches();
  return (
    <LancheItemStyle
      key={item.id}
      className="lanche"
      item={item}
      onClick={() => setEditando(item.id)}
    >
      <aside className="esq">
        <Imagem url={item.imagemUrl} />

        <Estoque
          item={item}
          url="/lanches"
          chave="lanches"
          setProds={setLanches}
          display="vertical"
        />
      </aside>
      <aside className="dir">
        <h5 className="nome">
          <span>{item.nome}</span>
          {/* <span style={{ marginRight: "5px" }}>•</span> */}
          {/* <span>{item.categoria ?? "s/Categ"}</span> */}
        </h5>

        <Descricao item={item} />

        <Checkers
          item={item}
          infoExtra={[`💲${formatCurrency(item.valor)}`]}
          setStat={(s) => {
            const data = { [s.t]: s.v, estoque: null };
            salvar("/lanches", "lanches", [{ ...item, ...data }]);
            upsertArray(item, setLanches, data);
          }}
        />
      </aside>
    </LancheItemStyle>
  );
};
