import { IDeveEstar } from "@models/deveEstar";
import { ICliente } from "tpdb-lib";

export interface ObterProduto {
  id: string;
  _cliente: ICliente | string | undefined;
  deveEstar?: IDeveEstar;
}
export interface ObterProdutos {
  _cliente: ICliente | string | undefined;
  deveEstar?: IDeveEstar;
}
