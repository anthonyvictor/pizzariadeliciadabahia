import { IPizzaSabor } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PizzaSaboresModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { aplicarValorMedSabores, sortSabores } from "@util/pizza";
import { analisarRegras } from "@util/regras";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { obterPedido } from "../pedidos";
import { deve_estar, dvEst } from "@models/deveEstar";
import { bulkUpsert } from "src/infra/mongodb/util";
import { sortDisp, toArray } from "@util/array";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaSabor>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterSabor({
        id: req.query.id as string,
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterSabores({
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else if (req.method === "POST") {
    let data;
    const { sabores } = req.body;

    if (!sabores) return res.status(400).end();

    data = await upsertSabores(toArray(sabores));
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterSabor = async ({ id, _pedido }: ObterProduto) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const data = (await ffid({
    m: PizzaSaboresModel,
    id,
  })) as unknown as IPizzaSabor;

  return {
    ...data,
    emCondicoes: (() => {
      const { v } = analisarRegras({ item: data, pedido });
      return v;
    })(),
  };
};

export const obterSabores = async ({
  _pedido,
  ignorar,
  deveEstar = dvEst.visivel,
}: ObterProdutos) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const data = sortSabores(
    sortDisp(
      aplicarValorMedSabores(
        deve_estar(
          (
            (await ff({ m: PizzaSaboresModel })) as unknown as IPizzaSabor[]
          ).map((x) => ({
            ...x,
            emCondicoes: (() => {
              const { v } = analisarRegras({ item: x, pedido, ignorar });
              return v;
            })(),
          })),
          deveEstar
        )
      )
    )
  );
  return data;
};

export const upsertSabores = async (sabores: IPizzaSabor[]) => {
  const data = await bulkUpsert(sabores, PizzaSaboresModel);
  return data;
};
