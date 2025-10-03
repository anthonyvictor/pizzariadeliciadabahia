import { IBebida } from "tpdb-lib";
import { useBebidas } from "./context";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { formatCurrency } from "@util/format";
import { BebidaItemStyle } from "./styles";
import { Estoque } from "src/views/loja/components/listas/estoque";
import { upsertArray } from "@util/state";
import { salvar } from "../../util/func";
import { Descricao } from "src/views/loja/components/listas/descricao";

export const BebidaItem = ({ item }: { item: IBebida }) => {
  const { setEditando, setBebidas } = useBebidas();
  return (
    <BebidaItemStyle
      key={item.id}
      className="bebida"
      item={item}
      onClick={() => setEditando(item.id)}
    >
      <aside className="esq">
        <Imagem url={item.imagemUrl} aspectRatio={"portrait"} />
        <Estoque
          item={item}
          url="/bebidas"
          chave="bebidas"
          setProds={setBebidas}
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
            salvar("/bebidas", "bebidas", [{ ...item, ...data }]);
            upsertArray(item, setBebidas, data);
          }}
        />
      </aside>
    </BebidaItemStyle>
  );
};
