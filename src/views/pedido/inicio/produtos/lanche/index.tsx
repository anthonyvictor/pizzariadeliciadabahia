import { useState } from "react";
import Image from "next/image";
import { abreviarLanche } from "@util/lanches";
import { capitalize, formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { LancheStyle } from "./styles";
import { ILanche } from "tpdb-lib";
import { camelCase } from "lodash";

export const Lanche = ({ prod }: { prod: ILanche }) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  return (
    <LancheStyle
      disabled={locked}
      onClick={() => {
        setLocked(true);
        router.push(`/pedido/item/lanche/${prod.id}`);
      }}
    >
      <aside className="prod-img">
        <Image
          src={prod.imagemUrl}
          width={60}
          height={60}
          style={{ flexShrink: 0 }}
          objectFit="cover"
          priority
        />
      </aside>
      <aside className="conteudo">
        <h5>{capitalize(abreviarLanche(prod.nome.toUpperCase()))}</h5>
        {!!prod.descricao && (
          <p style={{ fontSize: "0.7rem" }}>{prod.descricao}</p>
        )}
        <h6>{formatCurrency(prod.valor)}</h6>
      </aside>
    </LancheStyle>
  );
};
