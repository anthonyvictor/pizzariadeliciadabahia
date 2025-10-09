import { ICombo } from "tpdb-lib";
import { useCombos } from "./context";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { formatCurrency } from "@util/format";
import { ComboItemStyle } from "./styles";
import { Estoque } from "src/views/loja/components/listas/estoque";
import { upsertArray } from "@util/state";
import { salvar } from "../../util/func";
import { Descricao } from "src/views/loja/components/listas/descricao";

export const ComboItem = ({ item }: { item: ICombo }) => {
  const { setEditando, setCombos } = useCombos();
  return (
    <ComboItemStyle
      key={item.id}
      className="combo"
      item={item}
      onClick={() => setEditando(item.id)}
    >
      <aside className="esq">
        <Imagem url={item.imagemUrl} />
        <Estoque
          item={item}
          url="/combos"
          chave="combos"
          setProds={setCombos}
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
          infoExtra={[`💲${formatCurrency(item.valorMin)}`]}
          setStat={(s) => {
            const data = { [s.t]: s.v, estoque: null };
            salvar("/combos", "combos", [{ ...item, ...data }]);
            upsertArray(item, setCombos, data);
          }}
        />
      </aside>
    </ComboItemStyle>
  );
};
