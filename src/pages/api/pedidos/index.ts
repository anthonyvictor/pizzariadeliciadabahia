import { IPedido } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { EnderecosModel, PedidosModel } from "tpdb-lib";
import { RespType, salvarCookie } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { populates } from "tpdb-lib";
import { Types } from "mongoose";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPedido>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterPedido(req.query.id as string);
    } else {
      data = await obterPedidos();
    }
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const { clienteId } = req.body;
    const data = await novoPedido(clienteId);
    salvarCookie("pedidoId", data.id, res, 60 * 60 * 24 * 1); // expira em 1 dia

    res.end();
  } else if (req.method === "PATCH") {
    const { pedidoId, pedido } = req.body;
    await patchPedido(pedidoId, pedido);
    res.status(200).end();
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterPedidos = async () => {
  await conectarDB();

  const pedidos = await ff({
    m: PedidosModel,
    populates: populates.pedidos,
  });

  if (!pedidos) return [];

  const entregas = pedidos.filter(
    (x) => x.tipo === "entrega" && x.endereco?.cep
  );
  const ceps = entregas.map((x) => x.endereco.cep);
  const enderecosExtras = await ff({
    m: EnderecosModel,
    q: {
      cep: { $in: ceps },
    },
  });

  return pedidos.map((pedido) => {
    const endereco =
      pedido.tipo === "entrega" && pedido.endereco?.cep
        ? {
            ...pedido.endereco,
            ...enderecosExtras.find((e) => e.cep === pedido.endereco.cep),
          }
        : null;
    return { ...pedido, endereco: endereco || null };
  });
};

export const obterPedido = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  await conectarDB();

  const pedido = await ffid({
    m: PedidosModel,
    id: id,
    populates: populates.pedidos,
  });
  if (!pedido) return null;
  const enderecoExtra = pedido?.endereco?.cep
    ? (
        await ff({
          m: EnderecosModel,
          q: {
            cep: pedido.endereco.cep,
          },
        })
      )[0]
    : {};

  return {
    ...pedido,
    endereco:
      pedido.tipo === "entrega"
        ? {
            ...enderecoExtra,
            ...pedido.endereco,
            desconto: pedido.endereco.desconto ?? 0,
          }
        : null,
  };
};

export const novoPedido = async (cliente: string) => {
  await conectarDB();

  const res = await PedidosModel.create({ cliente });

  const data = await obterPedido(res._id.toString());

  return data;
};

export const patchPedido = async (
  id: string,
  dadosParaAlterar: Partial<IPedido>
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }

  await conectarDB();
  await PedidosModel.findByIdAndUpdate(
    id,
    { $set: dadosParaAlterar },
    { new: true } // retorna o documento atualizado
  );
};
