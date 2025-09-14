import TextContainer from "@components/textContainer";
import { TamanhosViewStyle } from "./styles";
import Image from "next/image";
import { useTamanhos } from "./context";
import { Checker } from "@components/checker";
import { FloatButton } from "@styles/components/buttons";

export const TamanhosView = () => {
  const { tamanhos, setEditando } = useTamanhos();

  return (
    <TamanhosViewStyle>
      <TextContainer title="Tamanhos" />
      <ul className="tamanhos no-scroll">
        {tamanhos.map((item) => (
          <li
            key={item.id}
            className="tamanho"
            onClick={() => setEditando(item.id)}
          >
            <aside className="esq">
              <div className="img-container">
                <Image src={item.imagemUrl} layout="fill" />
              </div>
            </aside>
            <aside className="dir">
              <h4>{item.nome}</h4>
              {item.descricao && <p className="descricao">{item.descricao}</p>}
              <footer>
                <small className="tamanhoAprox">
                  Tam: {item.tamanhoAprox}cm
                </small>
                <small className="fatias">{item.fatias} fatias</small>
                <small className="sabores">{item.maxSabores} sabores</small>
                {item.somenteEmCombos && (
                  <small className="somente-combos">Somente em combos</small>
                )}
              </footer>
              <div className="checkers">
                <div className="disponivel">
                  <Checker label={"Disp."} checked={item.disponivel} />
                </div>
                <div className="visivel">
                  <Checker label={"Visi."} checked={item.visivel} />
                </div>
              </div>
            </aside>
          </li>
        ))}
      </ul>
      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
    </TamanhosViewStyle>
  );
};
