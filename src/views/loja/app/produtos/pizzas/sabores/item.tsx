import { IPizzaSabor } from "tpdb-lib";
import { useSabores } from "./context";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { formatCurrency } from "@util/format";
import { Estoque } from "src/views/loja/components/listas/estoque";
import { Descricao } from "src/views/loja/components/listas/descricao";
import { salvar } from "../../../util/func";
import { upsertArray } from "@util/state";
import { SaborItemStyle } from "./styles";

export const SaborItem = ({ item }: { item: IPizzaSabor }) => {
  const { setEditando, setSabores } = useSabores();

  const valores = item.valores.map((x) => x.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);

  return (
    <SaborItemStyle
      key={item.id}
      item={item}
      className="sabor"
      onClick={() => setEditando(item.id)}
    >
      <aside className="esq">
        <Imagem url={item.imagemUrl} />
        <Estoque
          item={item}
          url="/pizzas/sabores"
          chave="sabores"
          setProds={setSabores}
          display="vertical"
        />
      </aside>
      <aside className="dir" style={{ gap: "1px" }}>
        <small style={{ fontSize: "0.5rem", opacity: 0.6 }}>
          {item.categoria ?? "s/Categ"}
        </small>
        <h5 className="nome">{item.nome}</h5>

        <Descricao descricao={item.descricao} full={true} />

        <Checkers
          item={item}
          infoExtra={[
            `💲${formatCurrency(min).replace(",00", "")} - ${formatCurrency(
              max
            ).replace(",00", "")}`,
          ]}
          setStat={(s) => {
            const data = { [s.t]: s.v, estoque: null };
            salvar("/pizzas/sabores", "sabores", [{ ...item, ...data }]);
            upsertArray(item, setSabores, data);
          }}
        />
      </aside>
    </SaborItemStyle>
  );
};
