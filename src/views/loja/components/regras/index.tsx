import { IRegra } from "tpdb-lib";
import { RegrasStyle } from "./styles";

export const Regras = ({
  condicoes,
  excecoes,
}: {
  condicoes: IRegra[] | undefined;
  excecoes: IRegra[] | undefined;
}) => {
  return (
    <RegrasStyle>
      <ul></ul>
    </RegrasStyle>
  );
};
