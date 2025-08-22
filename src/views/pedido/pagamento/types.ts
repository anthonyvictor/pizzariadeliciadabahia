import { IPagamentoTipo } from "tpdb-lib";
import { ICupom } from "tpdb-lib";
import { IconType } from "react-icons";

export interface IMetodo {
  icone: IconType;
  tipo: IPagamentoTipo;
  titulo: string;
  cor: string;
  cupom?: ICupom;
  legenda: string;
  emoji: string;
}
