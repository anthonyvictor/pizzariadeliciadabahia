import { IDeveEstar } from "@models/deveEstar";
import { IPedido, IRegra } from "tpdb-lib";

interface Base {
  _pedido: IPedido | string | undefined;
  deveEstar?: IDeveEstar;
}
export interface ObterProduto extends Base {
  id: string;
}
export interface ObterProdutos extends Base {
  q?: any;
  ignorar?: IRegra["tipo"][];
}
