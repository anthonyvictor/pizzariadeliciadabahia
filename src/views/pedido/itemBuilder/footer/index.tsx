import { useItemBuilder } from "src/views/pedido/itemBuilder/context";
import { useState } from "react";
import { ItemBuilderFooterStyle } from "./styles";
import { NumberInput } from "@components/NumberInput";
import { formatCurrency } from "@util/format";
import { z } from "zod";
import { toast } from "react-toastify";
import { rolarEl } from "@util/dom";
import { IProdutoComboPizza } from "tpdb-lib";

export const ItemBuilderFooter = () => {
  const [qtd, setQtd] = useState(1);
  const { itensFinais, builder, continuar, aberto } = useItemBuilder();

  const pizzaSchema = z.object({
    tipo: z.literal("pizza"),
    builderId: z.string(),
    tamanho: z.string({ required_error: "Selecione um tamanho!" }),

    sabores: z
      .array(z.string({ required_error: "Selecione um sabor!" }))
      .min(1, "Insira 1 sabor pelo menos"),
    borda: z.string({
      required_error: "Selecione a borda da pizza",
    }),
    espessura: z.string({
      required_error: "Selecione a espessura da massa",
    }),
    ponto: z.string({
      required_error: "Selecione o ponto da massa",
    }),
    extras: z.array(z.string()),
  });
  const bebidaSchema = z.object(
    {
      tipo: z.literal("bebida"),
      bebidaOriginal: z.string({ required_error: "Selecione uma bebida!" }),

      builderId: z.string(),
    },
    { invalid_type_error: "Selecione uma bebida!" }
  );
  const lancheSchema = z.object(
    {
      tipo: z.literal("lanche"),
      lancheOriginal: z.string({ required_error: "Selecione um lanche!" }),

      builderId: z.string(),
    },
    { invalid_type_error: "Selecione um lanche!" }
  );
  const itemSchema = z.discriminatedUnion("tipo", [
    pizzaSchema,
    bebidaSchema,
    lancheSchema,
  ]);

  function validarItens() {
    for (const item of itensFinais) {
      const resultado = itemSchema.safeParse(item);
      if (!resultado.success) {
        const id = `${resultado.error.issues[0].path[0]}-${item.builderId}`;
        toast.error(`${resultado.error.issues[0].message}`);
        focarElFaltando(id);
        return false;
      }
    }

    if (builder.tipo === "combo") {
      const faltando = builder.combo.produtos.find((bd) =>
        itensFinais.every((x) => x.builderId !== bd.id)
      );
      if (faltando) {
        toast.error(`Insira o item pendente`);
        focarElFaltando(faltando.id);
        return false;
      }
    }
    return true;
  }

  //   const itensSchema = z.array(itemSchema).refine(
  //   (arr) => {
  //     const produtos =
  //       builder.tipo === "combo" ? builder.combo.produtos : [builder];
  //     const todosContemplados = produtos.every((x) =>
  //       arr.map((y) => y.builderId).includes(x.id)
  //     );
  //     return todosContemplados;
  //   },
  //   { message: "Insira todos os itens!" }
  // );

  const focarElFaltando = (id: string) => {
    const query = `[id*="${id}"]`;
    const els = document.querySelectorAll(query);
    if (els.length > 1) {
      // rolar(els[1]);
      rolarEl(els[1]?.id);
    } else if (els.length) {
      // rolar(els[0]);
      rolarEl(els[0]?.id);
    }
  };
  const [avancarDisabled, setAvancarDisabled] = useState(false);
  // const total = itensFinais.reduce((acc, curr) => acc + curr.valor, 0) * qtd;
  // const valorMinCadaItem =
  //   builder.tipo === "combo"
  //     ? builder.combo.produtos.reduce((acc, curr) => acc + curr.valorMin, 0)
  //     : builder.tipo === "pizza"
  //     ? builder.tamanho.valorMin
  //     : 0;
  const totalComExtra =
    builder.tipo === "combo"
      ? builder.combo.produtos.reduce((acc, curr) => {
          const valorMin = curr.valorMin;
          const itfs = itensFinais.filter((y) => y.builderId === curr.id);
          const valorFinal = itfs
            .map((itf) => {
              const r =
                (itf?.valor ?? 0) +
                (itf?.tipo !== "pizza"
                  ? 0
                  : itf.sabores.length
                  ? 0
                  : curr.valorMin);

              return r;
            })
            .reduce((acc, curr) => acc + curr, 0);

          return acc + Math.max(valorMin, valorFinal);
        }, 0)
      : builder.tipo === "pizza" && itensFinais[0]?.tipo === "pizza"
      ? (() => {
          const itf = itensFinais[0];
          return Math.max(
            itf.sabores.length
              ? itf.valor
              : itf.valor + builder.tamanho.valorMin,
            builder.tamanho.valorMin
          );
        })()
      : // Math.max(itensFinais[0].valor, builder.tamanho.valorMin)
        itensFinais?.[0]?.valor ??
        (builder.tipo === "bebida"
          ? builder.bebida.valor
          : builder.tipo === "lanche"
          ? builder.lanche.valor
          : 0);
  return (
    <ItemBuilderFooterStyle>
      <NumberInput
        style={{ flex: 0 }}
        value={qtd}
        setValue={setQtd}
        min={1}
        max={
          (builder.tipo === "bebida"
            ? builder.bebida.estoque
            : builder.tipo === "lanche"
            ? builder.lanche.estoque
            : builder.tipo === "combo"
            ? 1
            : 1) ?? 5
        }
        forceMin={true}
        alwaysShowMinus={true}
      />
      <button
        className="avancar"
        disabled={avancarDisabled}
        onClick={async () => {
          try {
            if (!aberto) return toast.error("Estamos fechados no momento!");
            setAvancarDisabled(true);
            const result = validarItens();
            if (result === true) await continuar(qtd);

            ///...................................................................
            // if (!result.success) {
            //   const error = result.error as ZodError; // 👈 força a tipagem
            //   error.errors.forEach((error) => {
            //     console.error(error);
            //     if (error.code === "invalid_union") {
            //       toast.error(`${error.path.join(".")} - ${error.message}`);
            //       // error.unionErrors.forEach((innerErrors, unionIndex) => {
            //       //   innerErrors.forEach((innerError) => {
            //       //     toast.error(
            //       //       `${innerError.path.join(".")} - ${innerError.message}`
            //       //     );
            //       //     console.error(
            //       //       "---------",
            //       //       innerError.message,
            //       //       "---------"
            //       //     );
            //       //     console.error(innerError);
            //       //     console.error("------------------");
            //       //   });
            //       // });
            //     } else {
            //       toast.error(error.message, { autoClose: 10000 });
            //       // toast.error(`${issue.path.join(".")} - ${issue.message}`);
            //     }
            //   });
            // }
          } catch (err) {
            console.error(err);
            toast.error(`${err}`);
          } finally {
            setAvancarDisabled(false);
          }
        }}
      >
        <h4>Continuar</h4>
        <h4>
          {formatCurrency(
            totalComExtra
            // builder.tipo === "combo"
            //   ? Math.max(total, builder.combo.valorMin)
            //   : builder.tipo === "pizza"
            //   ? Math.max(total, builder.tamanho.valorMin)
            //   : total
          )}
        </h4>
      </button>
    </ItemBuilderFooterStyle>
  );
};
