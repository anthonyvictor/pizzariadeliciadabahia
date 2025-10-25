import { ILanche } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { LanchesModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortLanches } from "@util/lanches";
import { analisarRegras } from "@util/regras";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { obterPedido } from "./pedidos";
import { deve_estar, dvEst } from "@models/deveEstar";
import { bulkUpsert } from "src/infra/mongodb/util";
import { sortDisp, toArray } from "@util/array";
import qs from "qs";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ILanche>>
) {
  if (req.method === "GET") {
    let data;
    const query = qs.parse(req.query);
    if (query.id) {
      data = await obterLanche({
        id: query.id as string,
        _pedido: query.pedidoId as any,
        deveEstar: query.deveEstar as any,
      });
    } else {
      data = await obterLanches({
        _pedido: query.pedidoId as any,
        deveEstar: query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else if (req.method === "POST") {
    let data;
    const { lanches } = req.body;

    if (!lanches) return res.status(400).end();

    data = await upsertLanches(toArray(lanches));
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterLanche = async ({ id, _pedido }: ObterProduto) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const data = (await ffid({ m: LanchesModel, id })) as unknown as ILanche;

  return {
    ...data,
    emCondicoes: (() => {
      const { v } = analisarRegras({ item: data, pedido });
      return v;
    })(),
  };
};

export const obterLanches = async ({
  _pedido,
  ignorar,
  deveEstar = dvEst.visivel,
}: ObterProdutos) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const data = sortDisp(
    sortLanches(
      deve_estar(
        ((await ff({ m: LanchesModel })) as unknown as ILanche[]).map((x) => ({
          ...x,
          emCondicoes: (() => {
            const { v } = analisarRegras({ item: x, pedido, ignorar });
            return v;
          })(),
        })),
        deveEstar
      )
    )
  );
  return data;
};

export const upsertLanches = async (lanches: ILanche[]) => {
  const data = await bulkUpsert(lanches, LanchesModel);
  return data;
};
