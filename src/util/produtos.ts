import { IProdutoBase } from "tpdb-lib";

export const elegivel = (a: IProdutoBase) =>
  a.disponivel && a.visivel && a.emCondicoes && a.estoque !== 0;
