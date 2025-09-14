import { useState } from "react";
import Image from "next/image";
import { capitalize, formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { TamanhoStyle } from "./styles";
import { IPizzaTamanho } from "tpdb-lib";
import { tamanhoDescricao } from "@util/pizza";
import { Indisp } from "../../indisp";

export const Tamanho = ({
  prod,
  disabled,
}: {
  prod: IPizzaTamanho;
  disabled?: boolean;
}) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  return (
    <TamanhoStyle
      disabled={
        locked ||
        disabled ||
        !prod.emCondicoes ||
        !prod.disponivel ||
        !prod.visivel ||
        prod.estoque === 0
      }
      onClick={() => {
        setLocked(true);
        router.push(`/pedido/item/pizza/${prod.id}`);
      }}
    >
      <aside className="prod-img">
        <Image src={prod.imagemUrl} layout="fill" priority alt="" />
      </aside>
      <aside className="conteudo">
        <h5>Pizza {capitalize(prod.nome.toUpperCase())}</h5>
        <p style={{ fontSize: "0.7rem" }}>{tamanhoDescricao(prod)}</p>
        <h6>À partir de {formatCurrency(prod.valorMin)}</h6>
      </aside>
      <Indisp prod={prod} />
    </TamanhoStyle>
  );
};
