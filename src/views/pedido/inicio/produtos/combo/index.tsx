import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { ComboStyle } from "./styles";
import { ICombo } from "tpdb-lib";

export const Combo = ({ prod }: { prod: ICombo }) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  return (
    <ComboStyle
      disabled={locked}
      onClick={() => {
        setLocked(true);
        router.push(`/pedido/item/combo/${prod.id}`);
      }}
    >
      <aside className="prod-img">
        <Image src={prod.imagemUrl} layout="fill" priority />
      </aside>
      <aside className="conteudo">
        <h5 className="nome">{prod.nome}</h5>
        <p style={{ fontSize: "0.7rem" }}>{prod.descricao}</p>
        <h6>À partir de {formatCurrency(prod.valorMin)}</h6>
      </aside>
    </ComboStyle>
  );
};
