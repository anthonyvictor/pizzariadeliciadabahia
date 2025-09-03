import { useState } from "react";
import Image from "next/image";
import { capitalize, formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { TamanhoStyle } from "./styles";
import { IPizzaTamanho } from "tpdb-lib";
import { tamanhoDescricao } from "@util/pizza";

export const Tamanho = ({ prod }: { prod: IPizzaTamanho }) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  return (
    <TamanhoStyle
      disabled={locked}
      onClick={() => {
        setLocked(true);
        router.push(`/pedido/item/pizza/${prod.id}`);
      }}
    >
      <aside className="prod-img">
        <Image src={prod.imagemUrl} layout="fill" priority />
      </aside>
      <aside className="conteudo">
        <h5>Pizza {capitalize(prod.nome.toUpperCase())}</h5>
        <p style={{ fontSize: "0.7rem" }}>{tamanhoDescricao(prod)}</p>
        <h6>À partir de {formatCurrency(prod.valorMin)}</h6>
      </aside>
    </TamanhoStyle>
  );
};
