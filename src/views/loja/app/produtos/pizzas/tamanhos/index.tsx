import TextContainer from "@components/textContainer";
import { TamanhosViewStyle } from "./styles";
import Image from "next/image";
import { useTamanhos } from "./context";
import { Checker } from "@components/checker";
import { FloatButton } from "@styles/components/buttons";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { formatCurrency } from "@util/format";

export const TamanhosView = () => {
  const { tamanhos, setEditando } = useTamanhos();

  return (
    <TamanhosViewStyle>
      <TextContainer title="Tamanhos" />
      <ul className="tamanhos no-scroll">
        {tamanhos.map((item) => {
          return (
            <li
              key={item.id}
              className="tamanho"
              onClick={() => setEditando(item.id)}
            >
              <aside className="esq">
                <Imagem url={item.imagemUrl} />
              </aside>
              <aside className="dir">
                <h4>{item.nome}</h4>
                {item.descricao && (
                  <p className="descricao">{item.descricao}</p>
                )}
                <footer>
                  <small className="tamanhoAprox">
                    Tam: {item.tamanhoAprox}cm
                  </small>
                  <small className="fatias">{item.fatias} fatias</small>
                  <small className="sabores">{item.maxSabores} sabores</small>
                </footer>
                <Checkers
                  item={item}
                  // infoExtra={[
                  //   `💲${formatCurrency(item?.valorMin ?? 0).replace(
                  //     ",00",
                  //     ""
                  //   )}`,
                  // ]}
                />
              </aside>
            </li>
          );
        })}
      </ul>
      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
    </TamanhosViewStyle>
  );
};
