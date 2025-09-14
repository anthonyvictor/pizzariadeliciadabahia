import { IBebida } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { BebidasModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortBebidas } from "@util/bebidas";
import { analisarRegras } from "@util/regras";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { obterPedido } from "./pedidos";
import { deve_estar, dvEst } from "@models/deveEstar";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IBebida>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterBebida({
        id: req.query.id as string,
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterBebidas({
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterBebida = async ({ id, _pedido }: ObterProduto) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const data = (await ffid({ m: BebidasModel, id })) as unknown as IBebida;

  const { v } = analisarRegras({ item: data, pedido });
  return { ...data, emCondicoes: v };
};

export const obterBebidas = async ({
  _pedido,
  ignorar,
  deveEstar = dvEst.visivel,
}: ObterProdutos) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const data = sortBebidas(
    deve_estar(
      ((await ff({ m: BebidasModel })) as unknown as IBebida[]).map((x) => ({
        ...x,
        emCondicoes: (() => {
          const { v } = analisarRegras({ item: x, pedido, ignorar });
          return v;
        })(),
      })),
      deveEstar
    )
  );
  return data;
};
