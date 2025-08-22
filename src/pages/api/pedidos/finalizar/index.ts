import type { NextApiRequest, NextApiResponse } from "next";
import { PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { IItemPedido } from "tpdb-lib";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IItemPedido>>
) {
  if (req.method === "POST") {
    const { pedidoId } = req.body;
    await finalizarPedido(pedidoId);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const finalizarPedido = async (pedidoId: string) => {
  await conectarDB();

  await PedidosModel.findByIdAndUpdate(pedidoId, {
    enviadoEm: new Date(),
  });
};
