import { IBebida, ICombo, ILanche, IPizzaTamanho } from "tpdb-lib";
import { Destaque } from "./destaque";
import { Bebida } from "./bebida";
import { Lanche } from "./lanche";
import { Tamanho } from "./tamanho";
import { Combo } from "./combo";
import { Grid, List, ProdutosStyle } from "./styles";
import { IProdutoHome } from "../context";
import { ReactElement, ReactNode, useState } from "react";

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

  const [mostrarIndisponiveis, setMostrarIndisp] = useState({
    combos: false,
    pizzas: false,
    bebidas: false,
    lanches: false,
  });
  const fInd = (arr: any[]) =>
    arr.filter((x) => !x.disponivel || !x.emCondicoes || x.estoque === 0);
  const fDis = (arr: any[]) =>
    arr.filter((x) => x.disponivel && x.emCondicoes && x.estoque !== 0);

  const Prod = ({
    disp,
    indsp,
    nm,
    Js,
  }: {
    disp: any;
    indsp: any;
    nm: string;
    Js: (props: { prod: any }) => any;
  }) => {
    const mp = (arr: any[]) =>
      arr.map((prod: any & { tipo: any }) => (
        <Js key={prod.id ?? prod.nome} prod={prod} />
      ));
    return (
      <>
        {mp(disp)}
        {!!indsp.length && (
          <>
            {!mostrarIndisponiveis[nm] && (
              <button
                className="mostrar-indisponiveis"
                onClick={() =>
                  setMostrarIndisp((prev) => ({ ...prev, [nm]: true }))
                }
              >
                Mostrar {nm} indisponíveis
              </button>
            )}
            {mostrarIndisponiveis[nm] && mp(indsp)}
          </>
        )}
      </>
    );
  };
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
          {(() => {
            const disp = fDis(itens);
            const indsp = fInd(itens);
            type tp = "combo";
            const nm = "combos";
            type Tp = ICombo;

            return <Prod disp={disp} indsp={indsp} nm={nm} Js={Combo} />;
          })()}
        </List>
      ) : "maxSabores" in iZero ? (
        <Grid cols={2}>
          {(() => {
            const disp = fDis(itens);
            const indsp = fInd(itens);
            type tp = "pizza";
            const nm = "pizzas";
            const Js = Tamanho;
            type Tp = IPizzaTamanho;

            const mp = (arr: any[]) =>
              arr.map((prod: Tp & { tipo: tp }) => (
                <Js key={prod.id ?? prod.nome} prod={prod} />
              ));
            return <Prod disp={disp} indsp={indsp} nm={nm} Js={Tamanho} />;
          })()}
        </Grid>
      ) : iZero.tipo === "bebida" ? (
        <List>
          {(() => {
            const disp = fDis(itens);
            const indsp = fInd(itens);
            type tp = "bebida";
            const nm = "bebidas";
            const Js = Bebida;
            type Tp = IBebida;

            const mp = (arr: any[]) =>
              arr.map((prod: Tp & { tipo: tp }) => (
                <Js key={prod.id ?? prod.nome} prod={prod} />
              ));
            return <Prod disp={disp} indsp={indsp} nm={nm} Js={Bebida} />;
          })()}
        </List>
      ) : (
        <List>
          {(() => {
            const disp = fDis(itens);
            const indsp = fInd(itens);
            type tp = "lanche";
            const nm = "lanches";
            const Js = Lanche;
            type Tp = ILanche;

            return <Prod disp={disp} indsp={indsp} nm={nm} Js={Lanche} />;
          })()}
        </List>
      )}
    </ProdutosStyle>
  );
};
