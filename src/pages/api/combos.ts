import { IBebida, ICombo, ILanche, IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { CombosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import {
  aplicarValorMinCombo,
  produtosDoComboDisponiveis,
  sortCombos,
} from "@util/combo";
import { populates } from "tpdb-lib";
import { analisarRegras } from "@util/regras";
import { obterPedido } from "./pedidos";
import { deve_estar, dvEst } from "@models/deveEstar";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ICombo>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterCombo({
        id: req.query.id as string,
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterCombos({
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterCombo = async ({
  id,
  _pedido,
  sabores,
  bebidas,
  lanches,
}: ObterProduto & {
  sabores?: IPizzaSabor[];
  bebidas?: IBebida[];
  lanches?: ILanche[];
}) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  let data = (await ffid({
    m: CombosModel,
    id,
    populates: populates.combos,
  })) as unknown as ICombo;

  const trouxeProdutos = [sabores, bebidas, lanches]
    .filter(Boolean)
    .some((x) => x?.length);

  data = trouxeProdutos
    ? aplicarValorMinCombo(data, sabores, bebidas, lanches)
    : data;
  return {
    ...data,
    emCondicoes: (() => {
      const { v } = analisarRegras({ item: data, pedido });
      return v;
    })(),
  };
};

export const obterCombos = async ({
  _pedido,
  ignorar,
  deveEstar = dvEst.visivel,
  tamanhos,
  sabores,
  bebidas,
  lanches,
}: ObterProdutos & {
  tamanhos?: IPizzaTamanho[];
  sabores?: IPizzaSabor[];
  bebidas?: IBebida[];
  lanches?: ILanche[];
}) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const trouxeProdutos = [sabores, bebidas, lanches]
    .filter(Boolean)
    .some((x) => x?.length);
  const _data = (await ff({
    m: CombosModel,
    populates: populates.combos,
  })) as unknown as ICombo[];

  const data = sortCombos(
    deve_estar(
      _data
        .map((x) => ({
          ...x,
          emCondicoes: (() => {
            const { v } = analisarRegras({ item: x, pedido, ignorar });
            const prodsDisp = produtosDoComboDisponiveis(
              x,
              tamanhos,
              sabores,
              bebidas,
              lanches
            );

            // produtoDispPelasRegras(x, cliente, produtosDevemEstar);
            return v && prodsDisp;
          })(),
        }))
        .map((x) =>
          trouxeProdutos
            ? aplicarValorMinCombo(x, sabores, bebidas, lanches)
            : x
        ),
      deveEstar
    )
  ).map((combo) => {
    let estoque = combo.estoque;
    const estoqueMin: {
      tamanhos: { id: string; val: number }[];
      bebidas: { id: string; val: number }[];
      lanches: { id: string; val: number }[];
    } = {
      tamanhos: [],
      bebidas: [],
      lanches: [],
    };
    combo.produtos.forEach((prod) => {
      if (prod.tipo === "pizza") {
        const i = estoqueMin.tamanhos.findIndex(
          (x) => x.id === prod.tamanho.id
        );

        if (i > -1) {
          estoqueMin.tamanhos[i].val += 1;
        } else {
          estoqueMin.tamanhos.push({ id: prod.tamanho.id, val: 1 });
        }
      } else if (prod.tipo === "bebida") {
        const disponiveis = bebidas
          .filter((x) =>
            prod.bebidas?.length
              ? prod.bebidas.some((y) => y.id === x.id)
              : true
          )
          .filter(
            (x) => x.emCondicoes && x.visivel && x.disponivel && x.estoque !== 0
          );
        const estoqueDisponiveis = disponiveis.some((x) => x.estoque == null)
          ? 999999
          : disponiveis.reduce((acc, curr) => acc + curr.estoque, 0);

        if ((prod.min ?? 1) > estoqueDisponiveis) {
          estoque = 0;
        }
      } else {
        const disponiveis = lanches
          .filter((x) =>
            prod.lanches?.length
              ? prod.lanches.some((y) => y.id === x.id)
              : true
          )
          .filter(
            (x) => x.emCondicoes && x.visivel && x.disponivel && x.estoque !== 0
          );
        const estoqueDisponiveis = disponiveis.some((x) => x.estoque == null)
          ? 999999
          : disponiveis.reduce((acc, curr) => acc + curr.estoque, 0);

        if ((prod.min ?? 1) > estoqueDisponiveis) {
          estoque = 0;
        }
      }
    });

    estoqueMin.tamanhos.forEach((t) => {
      const tam = tamanhos.find((x) => x.id === t.id);

      if (tam.estoque != null && t.val > tam.estoque) {
        estoque = 0;
      }
    });

    return { ...combo, estoque };
  });
  return data;
};
