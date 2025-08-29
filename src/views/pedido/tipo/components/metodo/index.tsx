import { IconType } from "react-icons";
import { MetodoStyle } from "./styles";
import { formatCurrency } from "@util/format";

export const Metodo = ({
  nome,
  descricao,
  Icone,
  taxa,
  desconto,
}: {
  nome: string;
  descricao: string;
  Icone: IconType;
  taxa: number;
  desconto?: number;
}) => {
  return (
    <MetodoStyle>
      <aside className="icone-nome">
        {<Icone />}
        <h2 className="nome">{nome}</h2>
      </aside>
      <aside className="descricao-valor">
        <p className="descricao">{descricao}</p>
        <span className="valor">Taxa: {formatCurrency(taxa - desconto)}</span>
      </aside>
    </MetodoStyle>
  );
};
