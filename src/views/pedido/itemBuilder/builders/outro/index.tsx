import { IItemBuilderBebidas, IItemBuilderLanches } from "tpdb-lib";
import { useEffect, useState } from "react";
import { OutroBuilderStyle } from "./styles";
import { Checklist } from "@components/Checklist";
import { rolarEl } from "@util/dom";
import {
  ItemComBuilder,
  useItemBuilder,
} from "src/views/pedido/itemBuilder/context";
import { abreviarBebida } from "@util/bebidas";
import { abreviarLanche } from "@util/lanches";
import {
  IAcaoProdutoBebida,
  IAcaoProdutoLanche,
  IBebida,
  ILanche,
} from "tpdb-lib";
import { ItemBuilderObservacoes } from "../../observacoes";
import { elegivel } from "@util/produtos";

export const OutroBuilder = ({
  currentItem,
  builder,
  isCombo = false,
  outroNumber = 0,
}: {
  currentItem?: IBebida | ILanche;
  builder: IItemBuilderBebidas | IItemBuilderLanches;
  nextEl: string;
  outroNumber?: number;
  isCombo?: boolean;
}) => {
  const [outro, setOutro] = useState<IBebida | ILanche | undefined>(
    currentItem
  );
  const [observacoes, setObservacoes] = useState("");

  /**
   * Obtem o valor máximo dos sabores antes de aplicar valor extra
   * Por ex: a ação do produto prevê valor fixo, e caso ultrapasse R$ x,xx
   * o valor do sabor será: valorFixo + (valorSabor - valorFixo)
   */
  const obterValorMax = (
    acoes: (IAcaoProdutoBebida | IAcaoProdutoLanche)[] | undefined
  ) => {
    let valorMax = -1;
    (acoes ?? []).forEach((acao) => {
      switch (acao.tipo) {
        case "desconto_percentual":
          // const valorRealDesconto = valorSabores * (acao.valor / 100);
          // valorSabores =
          //   valorSabores -
          //   (acao.maxDesconto != null
          //     ? valorRealDesconto > acao.maxDesconto
          //       ? acao.maxDesconto
          //       : valorRealDesconto
          //     : valorRealDesconto);
          break;
        case "desconto_fixo":
          // valorSabores =
          //   valorSabores - acao.valor >= 0 ? valorSabores - acao.valor : 0;
          break;
        case "valor_fixo":
          valorMax = acao.maxValor != null ? acao.maxValor : -1;

          break;
      }
    });

    return valorMax;
  };

  const valorMax = obterValorMax(builder.acoes);
  const { setItensFinais } = useItemBuilder();

  const calcularValor = (o: IBebida | ILanche) => {
    const valorBase = o?.valor ?? 0;
    let valorFinal = valorBase;

    if (valorBase > 0)
      (builder.acoes ?? []).forEach((acao) => {
        switch (acao.tipo) {
          case "desconto_percentual":
            const valorRealDesconto = valorBase * (acao.valor / 100);

            valorFinal =
              valorBase -
              (acao.maxDesconto != null
                ? valorRealDesconto > acao.maxDesconto
                  ? acao.maxDesconto
                  : valorRealDesconto
                : valorRealDesconto);
            break;
          case "desconto_fixo":
            valorFinal =
              valorBase - acao.valor >= 0 ? valorBase - acao.valor : 0;
            break;
          case "valor_fixo":
            (() => {
              if (acao.maxValor != null) {
                if (valorBase <= acao.maxValor) {
                  valorFinal = acao.valor;
                } else {
                  const valorSaboresExtra = valorBase - acao.maxValor;
                  valorFinal = acao.valor + valorSaboresExtra;
                }
              } else {
                valorFinal = acao.valor;
              }
            })();

            break;
        }
      });

    return valorFinal;
  };

  useEffect(() => {
    if (outro) {
      setItensFinais((_prev) => {
        const prev = [..._prev];
        const i = prev.findIndex((x) => x.builderId === builder.id);
        const _obj =
          builder.tipo === "bebida"
            ? {
                bebidaOriginal: outro.id,
              }
            : {
                lancheOriginal: outro.id,
              };

        const obj: ItemComBuilder = {
          ...outro,
          builderId: builder.id,
          tipo: builder.tipo,
          ...(_obj as any),
          valor: calcularValor(outro),
          observacoes,
        };

        if (i > -1) {
          prev[i] = obj;
        } else {
          prev.push(obj as any);
        }

        return prev;
      });
    }
  }, [outro, observacoes]);
  const outroNumberStr = `${outroNumber ? `da ${outroNumber}ª outro ` : ""}`;
  const prods = builder.tipo === "bebida" ? builder.bebidas : builder.lanches;

  return (
    <OutroBuilderStyle id={`builder-${builder.id}`}>
      <Checklist
        name={`ids-${builder.id}`}
        label={`${outroNumberStr}${
          builder.tipo === "bebida" ? `Bebida 🍹` : `Lanche 🍔`
        }`}
        description={"Selecione um item"}
        min={1}
        max={1}
        items={prods
          .sort((a, b) => b.vendidos - a.vendidos)
          .sort((a, b) => a.valor - b.valor)
          .sort((a, b) => {
            const aE = elegivel(a);
            const bE = elegivel(b);
            return aE && !bE
              ? 1
              : !aE && bE
              ? -1
              : a.disponivel === b.disponivel
              ? 0
              : a.disponivel
              ? -1
              : 1;
          })
          .map((x) => ({
            id: x.id,
            imageUrl: x.imagemUrl,
            imageWidth: builder.tipo === "bebida" ? "35px" : undefined,
            imageFit: builder.tipo === "bebida" ? "scale-down" : undefined,
            title:
              builder.tipo === "bebida"
                ? abreviarBebida(x.nome)
                : abreviarLanche(x.nome),
            description: x.descricao,
            disabled: !x.disponivel,
            oldPrice: Math.max(valorMax, x.valor),
            price: calcularValor(x),
            // valorMax > -1
            //   ? x.valor > valorMax
            //     ? x.valor - valorMax
            //     : 0
            //   : x.valor,
            isSum: isCombo,
          }))}
        value={[outro?.id].filter(Boolean)}
        setValue={([value]) => {
          setOutro(prods.find((x) => x.id === value));
        }}
        onDone={() => {
          rolarEl(`observacoes-${builder.id}`);
        }}
      />
      <ItemBuilderObservacoes
        builderId={builder.id}
        de={builder.tipo === "bebida" ? "da bebida" : "do lanche"}
        placeholder=""
        observacoes={observacoes}
        setObservacoes={setObservacoes}
      />
    </OutroBuilderStyle>
  );
};
