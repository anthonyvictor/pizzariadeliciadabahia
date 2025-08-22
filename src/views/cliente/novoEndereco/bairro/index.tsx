import { IBairro } from "tpdb-lib";
import { BairroViewStyle } from "./styles";
import TextContainer from "@components/textContainer";
import { MyInput } from "@components/pedido/myInput";
import { useState } from "react";
import { SetState } from "@config/react";
import { useRouter } from "next/router";

export const BairroView = ({ bairros }: { bairros: IBairro[] }) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const bairrosFiltrados = inputValue
    ? bairros.filter((x) =>
        x.nome.toLowerCase().includes(inputValue.toLowerCase())
      )
    : bairros;
  return (
    <BairroViewStyle>
      <TextContainer
        title="Selecione seu bairro"
        description="Entregamos somente nos bairros da lista abaixo:"
      />
      <MyInput
        name=""
        placeholder="Pesquise..."
        type="text"
        value={inputValue}
        setValue={setInputValue as SetState<string | number>}
        autoFocus
      />

      <ul className="bairros">
        {!!bairrosFiltrados.length ? (
          bairrosFiltrados
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((bairro) => {
              return (
                <li
                  className="bairro"
                  key={bairro.id}
                  onClick={() => {
                    sessionStorage.setItem("bairro", JSON.stringify(bairro));
                    router.push(`/cliente/novo-endereco/geolocalizacao`);
                  }}
                >
                  <span>{bairro.nome}</span>
                </li>
              );
            })
        ) : (
          <li className="bairro">
            <span>Não entregamos neste bairro</span>
          </li>
        )}
      </ul>
    </BairroViewStyle>
  );
};
