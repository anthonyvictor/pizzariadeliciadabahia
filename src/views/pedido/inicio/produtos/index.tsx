import { IBebida, ICombo, ILanche, IPizzaTamanho } from "tpdb-lib";
import { Destaque } from "./destaque";
import { Bebida } from "./bebida";
import { Lanche } from "./lanche";
import { Tamanho } from "./tamanho";
import { Combo } from "./combo";
import { Grid, List, ProdutosStyle } from "./styles";
import { IProdutoHome } from "../context";

export const Produtos = ({
  id,
  label,
  itens,
}: {
  id: string;
  label: string;
  itens: IProdutoHome[];
}) => {
  const iZero = itens[0];

  return (
    <ProdutosStyle id={`${id}-ul`}>
      <header>
        <h4>{label}</h4>
      </header>
      {id.toLowerCase().includes("destaq") ? (
        <Grid>
          {itens.map((prod) => (
            <Destaque key={prod.id ?? prod.nome} prod={prod} />
          ))}
        </Grid>
      ) : "produtos" in iZero ? (
        <List>
          {itens.map((prod: ICombo) => (
            <Combo key={prod.id ?? prod.nome} prod={prod} />
          ))}
        </List>
      ) : "maxSabores" in iZero ? (
        <List>
          {itens
            .map((prod: IPizzaTamanho) => prod)
            .sort((a, b) => b.valorMin - a.valorMin)
            .map((prod: IPizzaTamanho) => (
              <Tamanho key={prod.id ?? prod.nome} prod={prod} />
            ))}
        </List>
      ) : iZero.tipo === "bebida" ? (
        <List>
          {itens.map((prod: IBebida & { tipo: "bebida" }) => (
            <Bebida key={prod.id ?? prod.nome} prod={prod} />
          ))}
        </List>
      ) : (
        <List>
          {itens.map((prod: ILanche & { tipo: "lanche" }) => (
            <Lanche key={prod.id ?? prod.nome} prod={prod} />
          ))}
        </List>
      )}
    </ProdutosStyle>
  );
};
