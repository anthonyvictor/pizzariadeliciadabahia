import { IPizzaSabor, IPizzaTamanho } from "./pizza";

export interface IItem {
  id?: string;
  observacao?: string;
  tipo?: "pizza" | "bebida" | "outro";
  comboId?: string;
  valor: number;
}
export interface IPizza extends IItem {
  tamanho: IPizzaTamanho;
  sabores: Array<IPizzaSabor>;
}
