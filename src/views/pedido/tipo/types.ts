import { IEndereco } from "tpdb-lib";

export type Tipo =
  | { type: "entrega"; endereco: IEndereco }
  | { type: "retirada" };
