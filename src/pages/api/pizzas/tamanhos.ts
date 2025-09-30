import { IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PizzaTamanhosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { analisarRegras } from "@util/regras";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import qs from "qs";
import {
  aplicarValorMinTamanho,
  aplicarValorMinTamanhos,
  sortTamanhos,
} from "@util/pizza";
import { deve_estar, dvEst } from "@models/deveEstar";
import { obterPedido } from "@routes/pedidos";
import { toArray } from "@util/array";
import { bulkUpsert } from "src/infra/mongodb/util";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaTamanho>>
) {
  if (req.method === "GET") {
    let data;
    const { pedidoId, deveEstar } = qs.parse(req.query);
    if (req.query.id) {
      data = await obterTamanho({
        id: req.query.id as string,
        _pedido: pedidoId as any,
        deveEstar: deveEstar as any,
      });
    } else {
      data = await obterTamanhos({
        _pedido: pedidoId as any,
        deveEstar: deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else if (req.method === "POST") {
    let data;
    const { tamanhos } = req.body;

    if (!tamanhos) return res.status(400).end();

    data = await upsertTamanhos(toArray(tamanhos));
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterTamanho = async ({
  id,
  _pedido,
  sabores,
}: ObterProduto & { sabores?: IPizzaSabor[] | undefined }) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  let data = (await ffid({
    m: PizzaTamanhosModel,
    id,
  })) as unknown as IPizzaTamanho;

  data = aplicarValorMinTamanho(data, sabores);

  return {
    ...data,
    emCondicoes: (() => {
      const { v } = analisarRegras({ item: data, pedido });
      return v;
    })(),
  } as IPizzaTamanho;
};

export const obterTamanhos = async ({
  _pedido,
  deveEstar = dvEst.visivel,
  ignorar,
  sabores,
}: ObterProdutos & { sabores?: IPizzaSabor[] | undefined }) => {
  await conectarDB();
  const pedido = await obterPedido(_pedido);

  const data = sortTamanhos(
    aplicarValorMinTamanhos(
      deve_estar(
        (
          (await ff({ m: PizzaTamanhosModel })) as unknown as IPizzaTamanho[]
        ).map((x) => ({
          ...x,
          emCondicoes: (() => {
            const { v } = analisarRegras({ item: x, pedido, ignorar });
            return v;
          })(),
        })),
        deveEstar
      ),
      sabores
    )
  );

  return data as IPizzaTamanho[];
};

export const upsertTamanhos = async (tamanhos: IPizzaTamanho[]) => {
  const data = await bulkUpsert(tamanhos, PizzaTamanhosModel);
  return data;
};
