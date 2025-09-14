import { useState } from "react";
import Image from "next/image";
import { abreviarLanche } from "@util/lanches";
import { capitalize, formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { LancheStyle } from "./styles";
import { ILanche } from "tpdb-lib";
import { Indisp } from "../../indisp";

export const Lanche = ({
  prod,
  disabled,
}: {
  prod: ILanche;
  disabled?: boolean;
}) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  return (
    <LancheStyle
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
          alt=""
        />
      </aside>
      <aside className="conteudo">
        <h5>{capitalize(abreviarLanche(prod.nome.toUpperCase()))}</h5>
        {!!prod.descricao && <p className="descricao">{prod.descricao}</p>}
        <h6>{formatCurrency(prod.valor)}</h6>
      </aside>
      <Indisp prod={prod} />
    </LancheStyle>
  );
};
