import { IPizzaTamanho } from "tpdb-lib";
import { ValorStyle } from "./styles";
import { NumberInput } from "@components/NumberInput";

export const Valor = ({
  valor,
  setValor,
  tamanho,
}: {
  valor: number | undefined;
  setValor: (val: number) => void;
  tamanho: IPizzaTamanho;
}) => {
  return (
    <ValorStyle>
      <label>{tamanho.nome}</label>

      <NumberInput value={valor} setValue={setValor} editable={true} />
    </ValorStyle>
  );
};
