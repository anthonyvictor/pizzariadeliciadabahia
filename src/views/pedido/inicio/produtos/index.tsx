import { IBebida, ICombo, ILanche, IPizzaTamanho } from "tpdb-lib";
import { Destaque } from "./destaque";
import { Bebida } from "./bebida";
import { Lanche } from "./lanche";
import { Tamanho } from "./tamanho";
import { Combo } from "./combo";
import { Grid, List, ProdutosStyle } from "./styles";
import { IProdutoHome } from "../context";
import React, { ReactElement, ReactNode, useState } from "react";

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

  const ListOrGrid: React.FC<{
    arr: any[];
    children: ReactNode;
  }> = ({ arr, children }) =>
    arr.length % 2 === 0 ? (
      <Grid cols={2}>{children}</Grid>
    ) : (
      <List>{children}</List>
    );

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
        <Grid
          cols={
            itens.length === 8
              ? 4
              : itens.length === 6
                ? 3
                : itens.length === 4
                  ? 4
                  : 2
          }
        >
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
        <ListOrGrid arr={itens}>
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
        </ListOrGrid>
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
