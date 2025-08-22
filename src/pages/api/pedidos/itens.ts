import type { NextApiRequest, NextApiResponse } from "next";
import { ffid } from "tpdb-lib";
import { PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { IItemPedido, IItemPedidoIds } from "tpdb-lib";
import { obterPedido } from ".";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IItemPedido>>
) {
  if (req.method === "GET") {
    let data;
    if (!req.query.pedidoId) return res.status(400).end();

    data = await obterItens(req.query.id as string);

    res.status(200).json(data);
  } else if (req.method === "POST") {
    const { pedidoId, itens } = req.body;
    await addItem(pedidoId, itens);
    res.status(200).end();
  } else if (req.method === "DELETE") {
    const { "itemsIds[]": itemsIds, pedidoId } = req.query;

    if (!pedidoId || !itemsIds?.length) return res.status(400).end();

    await removeItem(pedidoId as string, itemsIds as string[]);
    res.status(200).end();
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const removeItem = async (pedidoId: string, itemsIds: string[]) => {
  await conectarDB();
  const res = await PedidosModel.findByIdAndUpdate(
    pedidoId,
    {
      $pull: {
        itens: {
          _id: { $in: itemsIds },
        },
      },
    }, // Só adiciona se não existir
    { new: true }
  );
};
export const addItem = async (pedidoId: string, itens: IItemPedidoIds[]) => {
  await conectarDB();
  const res = await PedidosModel.findByIdAndUpdate(
    pedidoId,
    {
      $push: {
        itens: {
          $each: itens,
        },
      },
    },
    { new: true }
  );
};

export const obterItens = async (pedidoId: string) => {
  await conectarDB();
  const pedido = await obterPedido(pedidoId);
  const data = pedido.itens;

  return data;
};
