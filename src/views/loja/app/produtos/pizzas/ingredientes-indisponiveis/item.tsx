import { Imagem } from "src/views/loja/components/listas/imagem";
import { useTamanhos } from "./context";
import { IPizzaTamanho } from "tpdb-lib";
import { TamanhoItemStyle } from "./styles";
import { Estoque } from "src/views/loja/components/listas/estoque";
import { Descricao } from "src/views/loja/components/listas/descricao";
import { formatCurrency } from "@util/format";
import { salvar } from "../../../util/func";
import { upsertArray } from "@util/state";
import { Checkers } from "src/views/loja/components/listas/checkers";

export const TamanhoItem = ({ item }: { item: IPizzaTamanho }) => {
  const { setEditando, setTamanhos } = useTamanhos();

  return (
    <TamanhoItemStyle
      key={item.id}
      className="tamanho"
      item={item}
      onClick={() => setEditando(item.id)}
    >
      <aside className="esq">
        <Imagem url={item.imagemUrl} />
        <Estoque
          item={item}
          url="/pizzas/tamanhos"
          chave="tamanhos"
          setProds={setTamanhos}
          display="vertical"
        />
      </aside>
      <aside className="dir">
        <h5>{item.nome}</h5>
        <Descricao descricao={item.descricao} />

        <footer>
          <small className="tamanhoAprox">Tam: {item.tamanhoAprox}cm</small>
          <small className="fatias">{item.fatias} fatias</small>
          <small className="sabores">{item.maxSabores} sabores</small>
        </footer>
        <Checkers
          item={item}
          infoExtra={[`💲${formatCurrency(item.valorMin ?? 0)}`]}
          setStat={(s) => {
            const data = { [s.t]: s.v, estoque: null };
            salvar("/pizzas/tamanhos", "tamanhos", [{ ...item, ...data }]);
            upsertArray(item, setTamanhos, data);
          }}
        />
      </aside>
    </TamanhoItemStyle>
  );
};
