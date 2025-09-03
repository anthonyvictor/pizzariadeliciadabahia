import { useState } from "react";
import Image from "next/image";
import { abreviarBebida } from "@util/bebidas";
import { capitalize, formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { BebidaStyle } from "./styles";
import { IBebida } from "tpdb-lib";
import { camelCase } from "lodash";

export const Bebida = ({ prod }: { prod: IBebida }) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  return (
    <BebidaStyle
      disabled={locked}
      onClick={() => {
        setLocked(true);
        router.push(`/pedido/item/bebida/${prod.id}`);
      }}
    >
      <aside className="prod-img">
        <Image
          src={prod.imagemUrl}
          width={40}
          height={60}
          objectFit="scale-down"
          priority
        />
      </aside>
      <aside className="conteudo">
        <h5>{capitalize(abreviarBebida(prod.nome.toUpperCase()))}</h5>
        <h6>{formatCurrency(prod.valor)}</h6>
      </aside>
    </BebidaStyle>
  );
};
