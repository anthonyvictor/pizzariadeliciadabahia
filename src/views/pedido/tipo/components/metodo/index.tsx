import { IconType } from "react-icons";
import { MetodoStyle } from "./styles";
import { formatCurrency } from "@util/format";
import { useTipoPage } from "../../context";
import { IMetodoEntrega } from "tpdb-lib";

export const Metodo = ({
  metodo,
  nome,
  descricao,
  Icone,
  taxa,
  desconto,
}: {
  metodo: IMetodoEntrega;
  nome: string;
  descricao: string;
  Icone: IconType;
  taxa: number;
  desconto?: number;
}) => {
  const { setTipo } = useTipoPage();
  return (
    <MetodoStyle
      onClick={() => {
        setTipo((prev) => ({
          ...prev,
          endereco: {
            ...prev["endereco"],
            metodo,
            taxa: taxa - desconto,
            desconto: metodo === "basico" ? desconto : 0,
          },
        }));
      }}
    >
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
