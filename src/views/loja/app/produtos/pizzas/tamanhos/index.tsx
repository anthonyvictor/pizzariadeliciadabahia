import TextContainer from "@components/textContainer";
import { TamanhosViewStyle } from "./styles";
import Image from "next/image";
import { useTamanhos } from "./context";
import { Checker } from "@components/checker";
import { FloatButton } from "@styles/components/buttons";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { formatCurrency } from "@util/format";
import { TamanhoItem } from "./item";
import { Lista } from "../../lista";

export const TamanhosView = () => {
  const { tamanhos, setEditando } = useTamanhos();

  return (
    <TamanhosViewStyle>
      <TextContainer title="Tamanhos" />
      <Lista name="tamanhos">
        {tamanhos.map((item) => (
          <TamanhoItem key={item.id} item={item} />
        ))}
      </Lista>
      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
    </TamanhosViewStyle>
  );
};
