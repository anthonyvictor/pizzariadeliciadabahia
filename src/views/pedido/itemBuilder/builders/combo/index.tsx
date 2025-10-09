import { IItemBuilderBebidas, IProdutoCombo } from "tpdb-lib";
import { IITemBuilderCombo } from "tpdb-lib";
import { PizzaBuilder } from "../pizza";
import { ComboBuilderStyle } from "./styles";
import React from "react";
import { OutroBuilder } from "../outro";
import { OutrosBuilder } from "../outros";
import { useItemBuilder } from "../../context";
export const ComboBuilder = ({
  builder,
  nextEl,
}: {
  builder: IITemBuilderCombo;
  nextEl: string;
}) => {
  const { itensFinais } = useItemBuilder();
  return (
    <ComboBuilderStyle className={`builder-${builder.id}`}>
      {builder.combo.produtos.map((prod: IProdutoCombo, i) => {
        const _nextBuilder = builder.combo.produtos[i + 1]?.id;
        const nextBuilder = _nextBuilder ? `builder-${_nextBuilder}` : nextEl;
        const number =
          builder.combo.produtos.filter((x) => x.tipo === "pizza").length > 1
            ? builder.combo.produtos
                .filter((x) => x.tipo === "pizza")
                .findIndex((x) => {
                  return x.id === prod.id;
                }) + 1
            : 0;
        return (
          <React.Fragment key={prod.id}>
            {prod.tipo === "pizza" ? (
              <PizzaBuilder
                isCombo={true}
                builder={{
                  id: prod.id,
                  tamanho: {
                    ...prod.tamanho,
                    maxSabores: prod.maxSabores ?? prod.tamanho.maxSabores,
                  },
                  bordas: prod.bordas ?? builder.bordas,
                  pontos: prod.pontos ?? builder.pontos,
                  espessuras: prod.espessuras ?? builder.espessuras,
                  sabores: prod.sabores ?? builder.sabores,
                  extras: prod.extras ?? builder.extras,
                  acoes: prod.acoes,
                  tipo: "pizza",
                }}
                nextEl={nextBuilder}
                pizzaNumber={number}
              />
            ) : (
              (() => {
                const obj =
                  prod.tipo === "bebida"
                    ? {
                        bebidas: prod.bebidas?.length
                          ? prod.bebidas
                          : builder.bebidas,
                      }
                    : {
                        lanches: prod.lanches?.length
                          ? prod.lanches
                          : builder.lanches,
                      };

                return (prod.max ?? 1) > 1 || (prod.min ?? 1) > 1 ? (
                  <OutrosBuilder
                    isCombo={true}
                    builder={{
                      id: prod.id,
                      ...(obj as any),
                      ...prod,
                      acoes: prod.acoes,
                      tipo: prod.tipo,
                    }}
                    nextEl={nextBuilder}
                    outroNumber={
                      builder.combo.produtos.filter((x) => x.tipo === prod.tipo)
                        .length > 1
                        ? builder.combo.produtos
                            .filter((x) => x.tipo === prod.tipo)
                            .findIndex((x) => {
                              return x.id === prod.id;
                            }) + 1
                        : 0
                    }
                  />
                ) : (
                  <OutroBuilder
                    isCombo={true}
                    builder={{
                      id: prod.id,
                      ...(obj as any),
                      acoes: prod.acoes,
                      tipo: prod.tipo,
                    }}
                    nextEl={nextBuilder}
                    outroNumber={
                      builder.combo.produtos.filter((x) => x.tipo === prod.tipo)
                        .length > 1
                        ? builder.combo.produtos
                            .filter((x) => x.tipo === prod.tipo)
                            .findIndex((x) => {
                              return x.id === prod.id;
                            }) + 1
                        : 0
                    }
                  />
                );
              })()
            )}
          </React.Fragment>
        );
      })}
    </ComboBuilderStyle>
  );
};
