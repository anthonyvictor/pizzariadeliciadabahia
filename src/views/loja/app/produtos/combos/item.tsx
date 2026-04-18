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

        <Descricao descricao={item.descricao} />

        <Checkers
          item={item}
          infoExtra={[`💲${formatCurrency(item.valorMin)}`]}
          setStat={(s) => {
            const data = { [s.t]: s.v, estoque: null };
            const itemToSave = { ...item };
            itemToSave.produtos = itemToSave.produtos.map((prod) => {
              const newProd = { ...prod };
              if (newProd.tipo === "pizza") {
                newProd.tamanho = newProd.tamanho.id as any;
                newProd.sabores = !newProd.sabores?.length
                  ? undefined
                  : newProd.sabores.map((sab) => sab.id as any);
                newProd.bordas = !newProd.bordas?.length
                  ? undefined
                  : newProd.bordas.map((bord) => bord.id as any);
                newProd.espessuras = !newProd.espessuras?.length
                  ? undefined
                  : newProd.espessuras.map((esp) => esp.id as any);
                newProd.pontos = !newProd.pontos?.length
                  ? undefined
                  : newProd.pontos.map((pont) => pont.id as any);
                newProd.extras = !newProd.extras?.length
                  ? undefined
                  : newProd.extras.map((extra) => extra.id as any);
              } else if (newProd.tipo === "bebida") {
                newProd.bebidas = !newProd.bebidas?.length
                  ? undefined
                  : newProd.bebidas.map((beb) => beb.id as any);
              } else if (newProd.tipo === "lanche") {
                newProd.lanches = !newProd.lanches?.length
                  ? undefined
                  : newProd.lanches.map((lan) => lan.id as any);
              }
              return newProd;
            });

            //             onst itemToSave: {
            //     produtos: IProdutoCombo[];
            //     valorMin: number;
            //     id: string;
            //     nome: string;
            //     descricao?: string;
            //     disponivel: boolean;
            //     imagemUrl?: string;
            //     visivel: boolean;
            //     vendidos: number;
            //     condicoes?: IRegra[];
            //     excecoes?: IRegra[];
            //     uuid?: string;
            //     estoque?: number;
            //     criadoEm: Date;
            //     dadosExtras?: IDado[];
            //     emCondicoes: boolean;
            // }

            salvar("/combos", "combos", [{ ...itemToSave, ...data }]);
            upsertArray(item, setCombos, data);
          }}
        />
      </aside>
    </ComboItemStyle>
  );
};
