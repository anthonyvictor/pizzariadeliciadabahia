import { IPizzaPedido } from "tpdb-lib";
import { IItemBuilderPizza } from "tpdb-lib";
import {
  IPizzaBorda,
  IPizzaExtra,
  IPizzaSabor,
  IPizzaTamanho,
  IAcaoProdutoPizza,
  IPizzaEspessura,
  IPizzaPonto,
} from "tpdb-lib";
import { useEffect, useState } from "react";
import { PizzaBuilderStyle } from "./styles";
import { Checklist } from "@components/Checklist";
import { rolarEl } from "@util/dom";
import { useItemBuilder } from "src/views/pedido/itemBuilder/context";
import { ItemBuilderObservacoes } from "../../observacoes";

export const PizzaBuilder = ({
  currentItem,
  builder,
  isCombo = false,
  nextEl,
  pizzaNumber = 0,
  collapsed = false,
}: {
  currentItem?: IPizzaPedido;
  builder: IItemBuilderPizza;
  nextEl: string;
  pizzaNumber?: number;
  isCombo?: boolean;
  collapsed?: boolean;
}) => {
  const [pizza, setPizza] = useState<IPizzaPedido>({
    tamanho: currentItem?.tamanho ?? builder.tamanho,
    sabores: currentItem?.sabores ?? [],
    valor: currentItem?.valor ?? 0,

    borda: currentItem?.borda,
    extras: currentItem?.extras ?? [],
  } as IPizzaPedido);

  const calcularValor = ({
    borda,
    espessura,
    extras,
    ponto,
    sabores,
    tamanho,
    acoes,
  }: {
    tamanho: IPizzaTamanho;
    sabores: IPizzaSabor[];
    borda: IPizzaBorda | undefined;
    extras: IPizzaExtra[];
    espessura: IPizzaEspessura | undefined;
    ponto: IPizzaPonto | undefined;
    acoes?: IAcaoProdutoPizza[];
  }) => {
    const valoresSabores = (sabores ?? [])
      .map((x) => x.valores)
      .flat()
      .filter((x) => x.tamanhoId === tamanho.id)
      .map((x) => x.valor, 0);

    let valorSabores = !valoresSabores?.length
      ? 0
      : valoresSabores.reduce((acc, curr) => acc + curr, 0) / sabores.length;

    let valorBorda =
      borda?.valores?.find?.((x) => x.tamanhoId === tamanho.id)?.valor ?? 0;
    const valorEspessura = espessura?.valor ?? 0;
    const valorPonto = ponto?.valor ?? 0;
    const valorExtras = extras.reduce((acc, curr) => acc + curr.valor, 0);
    // const subTotal = valorSabores + valorBorda + valorExtras;

    if (valorSabores > 0 || valorBorda > 0)
      (acoes ?? []).forEach((acao) => {
        switch (acao.tipo) {
          case "desconto_percentual_borda":
            const valorRealDescontoBorda = valorBorda * (acao.valor / 100);
            valorBorda =
              valorBorda -
              (acao.maxDesconto != null
                ? valorRealDescontoBorda > acao.maxDesconto
                  ? acao.maxDesconto
                  : valorRealDescontoBorda
                : valorRealDescontoBorda);
            break;
          case "desconto_percentual":
            const valorRealDesconto = valorSabores * (acao.valor / 100);

            valorSabores =
              valorSabores -
              (acao.maxDesconto != null
                ? valorRealDesconto > acao.maxDesconto
                  ? acao.maxDesconto
                  : valorRealDesconto
                : valorRealDesconto);
            break;
          case "desconto_fixo":
            valorSabores =
              valorSabores - acao.valor >= 0 ? valorSabores - acao.valor : 0;
            break;
          case "valor_fixo":
            (() => {
              if (acao.maxValor !== null) {
                if (valoresSabores.every((x) => x <= acao.maxValor)) {
                  valorSabores = acao.valor;
                } else {
                  const valorSaboresExtra = valoresSabores
                    .filter((x) => x > acao.maxValor)
                    .reduce((acc, curr) => acc + curr - acao.maxValor, 0);
                  // const valorSaboresExtra =valorSabores - acao.maxValor
                  valorSabores = acao.valor + valorSaboresExtra;
                }
              } else {
                valorSabores = acao.valor;
              }
            })();

            break;
        }
      });

    const valorFinal =
      valorSabores + valorBorda + valorEspessura + valorPonto + valorExtras;

    return valorFinal;
  };

  type Pizza = "pizza";

  const { setItensFinais } = useItemBuilder();
  useEffect(() => {
    setItensFinais((_prev) => {
      const prev = [..._prev];
      const i = prev.findIndex((x) => x.builderId === builder.id);
      const obj = {
        ...pizza,
        tamanho: pizza?.tamanho?.id,
        sabores: pizza.sabores.map((x) => x.id),
        borda: pizza.borda?.id,
        espessura: pizza.espessura?.id,
        ponto: pizza.ponto?.id,
        extras: pizza.extras.map((x) => x.id),
        builderId: builder.id,
        tipo: "pizza" as Pizza,
        observacoes: pizza.observacoes,
      };
      if (i > -1) {
        prev[i] = obj;
      } else {
        prev.push(obj);
      }

      return prev;
    });
  }, [pizza]); //eslint-disable-line
  const bordasDisp = (builder?.bordas ?? []).filter(
    (x) => x.disponivel && x.emCondicoes && x.estoque !== 0 && x.visivel
  );
  const pontosDisp = (builder.pontos ?? []).filter(
    (x) => x.disponivel && x.emCondicoes && x.estoque !== 0 && x.visivel
  );
  const espDisp = (builder.espessuras ?? []).filter(
    (x) => x.disponivel && x.emCondicoes && x.estoque !== 0 && x.visivel
  );
  const extrasDisp = (builder.espessuras ?? []).filter(
    (x) => x.disponivel && x.emCondicoes && x.estoque !== 0 && x.visivel
  );

  useEffect(() => {
    if (bordasDisp.length && pontosDisp.length && espDisp.length) {
      const obj: IPizzaPedido = {} as IPizzaPedido;
      if (bordasDisp.length === 1) {
        obj.borda = bordasDisp[0];
      }
      if (pontosDisp.length === 1) {
        obj.ponto = pontosDisp[0];
      }
      if (espDisp.length === 1) {
        obj.espessura = espDisp[0];
      }
      setPizza((prev) => ({ ...prev, ...obj }));
    }
  }, []); //eslint-disable-line

  const pizzaNumberStr = `${pizzaNumber ? `da ${pizzaNumber}ª pizza ` : ""}`;

  const grupos = builder.sabores.reduce<Record<string, IPizzaSabor[]>>(
    (acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = [];
      }
      acc[item.categoria].push(item);
      return acc;
    },
    {}
  );

  const gruposArray = Object.entries(grupos)
    .map(([grupo, itens]) => ({
      grupo,
      itens,
    }))
    .sort((a, b) => {
      const vm = (x) =>
        x.itens.reduce((acc, curr) => acc + (curr.valorMedio ?? 0), 0) /
        x.itens.length;
      return vm(a) - vm(b);
    })
    .map((g) => g.itens)
    .flat();
  const [saboresPref, setSaboresPref] = useState<string[]>([]);

  useEffect(() => {
    const pontoPref = localStorage.getItem("preferencias_ponto");
    if (pontoPref) {
      setPizza((prev) => ({
        ...prev,
        ponto: builder.pontos.find((x) => x.id === pontoPref) ?? prev.ponto,
      }));
    }
    const _saboresPref = (
      localStorage.getItem("preferencias_sabores") ?? ""
    ).split(",");
    if (_saboresPref?.length) {
      setSaboresPref(_saboresPref);
    }
  }, []);

  return (
    <PizzaBuilderStyle id={`builder-${builder.id}`}>
      {/* {!isCombo && (
        <Checklist
          name={`tamanho-${builder.id}`}
          label={`Tamanho ${pizzaNumberStr}📐`}
          required={true}
          items={[
            {
              id: builder.tamanho.id,
              title: builder.tamanho.nome,
              imageUrl: builder.tamanho.imagemUrl,
              description: tamanhoDescricao(builder.tamanho),
              minPrice: builder.tamanho.valorMin,
            },
          ]}
          value={pizza.tamanho.id}
          setValue={() => {}}
          onDone={() => {
            rolarEl(`checklist-sabores-${builder.id}`);
          }}
        />
      )} */}

      <Checklist
        name={`sabores-${builder.id}`}
        label={`Sabores ${pizzaNumberStr}🌶️`}
        min={1}
        max={pizza.tamanho.maxSabores}
        // collapsed={collapsed}
        description={`Selecione até ${pizza.tamanho.maxSabores} sabores`}
        // collapsed={true}
        // maxItemsCollapsed={6}
        // collapsedLabel="Mostrar mais sabores..."
        highlights={saboresPref}
        items={gruposArray
          .filter((x) => (isCombo ? !x.somenteEmCombos : true))
          .map((sab) => ({
            id: sab.id,
            imageUrl: sab.imagemUrl,
            group: sab.categoria,
            title: sab.nome,
            description: sab.descricao,
            disabled: !sab.disponivel,
            price:
              pizza.sabores.length === builder.tamanho.maxSabores
                ? ("" as unknown as number)
                : sab.valores
                    .filter((x) => x.tamanhoId === builder.tamanho.id)
                    .map((v) => {
                      let valorExtra = v.valor;

                      const valorSaboresAntes = calcularValor({
                        ...pizza,
                        sabores: pizza.sabores,
                        acoes: builder.acoes,
                      });
                      const valorSaboresDepois = calcularValor({
                        ...pizza,
                        sabores: [...pizza.sabores, sab],
                        acoes: builder.acoes,
                      });

                      valorExtra = valorSaboresDepois - valorSaboresAntes;

                      return valorExtra;
                    })[0],
            isSum: isCombo,
          }))}
        value={pizza.sabores.map((x) => x.id)}
        setValue={(novosSabores) => {
          const sabores = novosSabores.map(
            (x) => builder.sabores.find((y) => y.id === x)!
          );
          setPizza((prev) => ({
            ...prev,
            sabores,
            valor: calcularValor({
              ...pizza,
              sabores,
              acoes: builder.acoes,
            }),
          }));
        }}
        onDone={() => {
          rolarEl(
            bordasDisp.length > 1 && !pizza.borda
              ? `checklist-borda-${builder.id}`
              : espDisp.length > 1 && !pizza.espessura
              ? `checklist-espessura-${builder.id}`
              : pontosDisp.length > 1 && !pizza.ponto
              ? `checklist-ponto-${builder.id}`
              : !!extrasDisp.length
              ? `checklist-extras-${builder.id}`
              : nextEl
          );
        }}
      />

      {bordasDisp.length > 1 && (
        <Checklist
          name={`borda-${builder.id}`}
          label={`Borda ${pizzaNumberStr}🍕`}
          min={1}
          max={1}
          items={builder.bordas
            .filter((x) => (isCombo ? !x.somenteEmCombos : true))
            .map((x) => ({
              id: x.id,
              imageUrl: x.imagemUrl,
              title: x.nome,
              description: x.descricao,
              disabled: !x.disponivel,
              price: x.valores.find((x) => x.tamanhoId === builder.tamanho.id)
                .valor,
              isSum: true,
            }))}
          value={[pizza.borda?.id].filter(Boolean)}
          setValue={([value]) => {
            const borda = builder.bordas.find((x) => x.id === value)!;
            setPizza((prev) => ({
              ...prev,
              borda,
              valor: calcularValor({
                ...pizza,
                borda,
                acoes: builder.acoes,
              }),
            }));
          }}
          onDone={() => {
            rolarEl(
              espDisp.length > 1
                ? `checklist-espessura-${builder.id}`
                : pontosDisp.length > 1
                ? `checklist-ponto-${builder.id}`
                : !!extrasDisp.length
                ? `checklist-extras-${builder.id}`
                : nextEl
            );
          }}
        />
      )}

      {espDisp.length > 1 && (
        <Checklist
          name={`espessura-${builder.id}`}
          label={`Espessura da massa ${pizzaNumberStr}🍕`}
          description="Como você prefere a massa?"
          min={1}
          max={1}
          items={builder.espessuras
            .filter((x) => (isCombo ? !x.somenteEmCombos : true))
            .map((x) => ({
              id: x.id,
              imageUrl: x.imagemUrl,
              title: x.nome,
              description: x.descricao,
              disabled: !x.disponivel,
              price: x.valor,
              isSum: true,
            }))}
          value={[pizza.espessura?.id].filter(Boolean)}
          setValue={([value]) => {
            const espessura = builder.espessuras.find((x) => x.id === value)!;
            setPizza((prev) => ({
              ...prev,
              espessura,
              valor: calcularValor({
                ...pizza,
                espessura,
                acoes: builder.acoes,
              }),
            }));
          }}
          onDone={() => {
            rolarEl(
              pontosDisp.length > 1
                ? `checklist-ponto-${builder.id}`
                : !!extrasDisp.length
                ? `checklist-extras-${builder.id}`
                : nextEl
            );
          }}
        />
      )}
      {pontosDisp.length > 1 && (
        <Checklist
          name={`ponto-${builder.id}`}
          label={`Ponto ${pizzaNumberStr}🍕`}
          description="Qual seu ponto da massa preferido?"
          min={1}
          max={1}
          items={builder.pontos
            .filter((x) => (isCombo ? !x.somenteEmCombos : true))
            .map((x) => ({
              id: x.id,
              imageUrl: x.imagemUrl,
              title: x.nome,
              description: x.descricao,
              disabled: !x.disponivel,
              price: x.valor,
              isSum: true,
            }))}
          value={[pizza.ponto?.id].filter(Boolean)}
          setValue={([value]) => {
            const ponto = builder.pontos.find((x) => x.id === value)!;
            setPizza((prev) => ({
              ...prev,
              ponto,
              valor: calcularValor({
                ...pizza,
                ponto,
                acoes: builder.acoes,
              }),
            }));
          }}
          onDone={() => {
            rolarEl(
              !!extrasDisp.length ? `checklist-extras-${builder.id}` : nextEl
            );
          }}
        />
      )}

      {(builder.extras?.filter?.((x) => x.disponivel)?.length ?? 0) > 0 && (
        <Checklist
          name={`extras-${builder.id}`}
          label={`Adicionais ${pizzaNumberStr}➕`}
          min={0}
          max={10}
          collapsed={true}
          description={`Quer adicionar algum ingrediente extra?`}
          items={builder.extras
            .filter((x) => (isCombo ? !x.somenteEmCombos : true))
            .map((x) => {
              return {
                id: x.id,
                imageUrl: x.imagemUrl,
                title: x.nome,
                description: x.descricao,
                disabled: !x.disponivel,
                price: x.valor,
                isSum: true,
              };
            })}
          value={pizza.extras.map((x) => x.id)}
          setValue={(novosExtras) => {
            const extras = novosExtras.map(
              (x) => builder.extras.find((y) => y.id === x)!
            );
            setPizza((prev) => ({
              ...prev,
              extras,
              valor: calcularValor({ ...pizza, extras, acoes: builder.acoes }),
            }));
          }}
          onDone={() => {
            rolarEl(`observacoes-${builder.id}`);
          }}
        />
      )}
      <ItemBuilderObservacoes
        builderId={builder.id}
        de={pizzaNumberStr || "da pizza"}
        placeholder="Ex: Sem cebola, pouco orégano"
        observacoes={pizza.observacoes}
        setObservacoes={(observacoes) =>
          setPizza((prev) => ({ ...prev, observacoes }))
        }
      />
    </PizzaBuilderStyle>
  );
};
