import { useState } from "react";
import { IProdutoHome } from "../../context";
import { DestaqueStyle } from "./styles";
import Image from "next/image";
import { abreviarBebida } from "@util/bebidas";
import { abreviarLanche } from "@util/lanches";
import { capitalize, formatCurrency } from "@util/format";
import { useRouter } from "next/router";

export const Destaque = ({ prod }: { prod: IProdutoHome }) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  return (
    <DestaqueStyle
      disabled={locked}
      onClick={() => {
        setLocked(true);
        router.push(
          `/pedido/item/${"maxSabores" in prod ? "pizza" : prod["tipo"]}/${
            prod.id
          }`
        );
      }}
    >
      <aside className="prod-img">
        <Image
          src={prod.imagemUrl}
          objectFit={
            "tipo" in prod && prod.tipo === "bebida" ? "scale-down" : "cover"
          }
          layout="fill"
          priority
        />
      </aside>
      <aside className="conteudo">
        <h6 className="nome">
          {("maxSabores" in prod
            ? `P. ${prod.nome}`
            : "produtos" in prod
            ? prod.nome
            : prod.tipo === "bebida"
            ? abreviarBebida(prod.nome, true)
            : abreviarLanche(prod.nome)
          ).toUpperCase()}
        </h6>
        {!!prod["valorMin"] && (
          <p style={{ fontSize: "0.6rem", opacity: "0.6" }}>À partir de</p>
        )}

        <h6>{formatCurrency(prod["valorMin"] ?? prod["valor"])}</h6>
        {/* {prod["valorMin"] &&
          prod. && (
            <i className="old-price">{formatCurrency(prod["valor"])}</i>
          )} */}
      </aside>
    </DestaqueStyle>
  );
};
