import { useState } from "react";
import Image from "next/image";
import { destrincharBebida } from "@util/bebidas";
import { formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { BebidaStyle } from "./styles";
import { IBebida } from "tpdb-lib";
import { Indisp } from "../../indisp";

export const Bebida = ({
  prod,
  disabled,
}: {
  prod: IBebida;
  disabled?: boolean;
}) => {
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  if (prod.id === "6716c7d3399e4f23ba4f87c8") {
    console.log(prod);
  }

  return (
    <BebidaStyle
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
          alt=""
        />
      </aside>
      <aside className="conteudo">
        {(() => {
          const { tipo, tamanho, sabor, completo } = destrincharBebida(
            prod.nome
          );

          return (
            <>
              {completo ? (
                <h5>
                  {completo.toUpperCase()} {tamanho.toUpperCase()}
                </h5>
              ) : (
                <>
                  <small style={{ fontSize: "0.6rem", opacity: "0.5" }}>
                    {tipo.toUpperCase()}
                  </small>
                  <h5>
                    {sabor.toUpperCase()} {tamanho.toUpperCase()}
                  </h5>
                </>
              )}
            </>
          );
        })()}

        <h6>{formatCurrency(prod.valor)}</h6>
      </aside>
      <Indisp prod={prod} />
    </BebidaStyle>
  );
};
