import { IEnderecoPedido } from "tpdb-lib";

export type Tipo =
  | { type: "entrega"; endereco: IEnderecoPedido }
  | { type: "retirada" };
