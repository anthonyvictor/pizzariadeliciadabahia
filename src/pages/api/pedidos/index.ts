import { IPedido } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { populates } from "tpdb-lib";
import mongoose, { Types } from "mongoose";
import { obterCliente, obterClientes } from "@routes/clientes";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPedido>>
) {
  if (req.method === "GET") {
    let data;
    const { id, comEnderecoCompleto, ids } = req.query;
    if (id) {
      data = await obterPedido(id as string, comEnderecoCompleto as any);
    } else {
      data = await obterPedidos({
        ids: ids as any,
        comEnderecoCompleto: comEnderecoCompleto as any,
      });
    }
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const { clienteId } = req.body;
    const data = await novoPedido(clienteId);
    res.end();
  } else if (req.method === "PATCH") {
    const { pedidoId, pedido } = req.body;
    await patchPedido(pedidoId, pedido);
    res.status(200).end();
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterPedidos = async ({
  ids,
  comEnderecoCompleto = true,
}: {
  ids?: string[];
  clientesIds?: string[];
  comEnderecoCompleto?: boolean;
}) => {
  await conectarDB();

  const q: any = {};
  if (ids && ids.length)
    q._id = { $in: ids.map((x) => new mongoose.Types.ObjectId(x)) };

  let pedidos = await ff({
    m: PedidosModel,
    q,
    populates: populates.pedidos.filter((x) => x.path !== "cliente"),
  });

  if (!pedidos) return [];

  const clientes = await obterClientes({
    ids: pedidos.map((x) => x.cliente.id),
    comEnderecoCompleto,
  });

  return pedidos.map((pedido) => {
    const cliente = clientes.find((x) => x.id === pedido.cliente.id);
    const endereco =
      pedido.tipo === "entrega" && pedido.endereco?.cep
        ? {
            ...((cliente.enderecos ?? []).find(
              (e) => e.cep === pedido.endereco.cep
            ) ?? {}),
            ...pedido.endereco,
          }
        : null;
    return { ...pedido, endereco, cliente };
  });
};

export const obterPedido = async (id: string, comEnderecoCompleto = true) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
  await conectarDB();

  const pedido = await ffid({
    m: PedidosModel,
    id: id,
    populates: populates.pedidos.filter((x) => x.path !== "cliente"),
  });
  if (!pedido) return null;

  const cliente = await obterCliente(pedido.cliente.id, comEnderecoCompleto);

  return {
    ...pedido,
    cliente,
    endereco:
      pedido.tipo === "entrega"
        ? {
            ...((cliente.enderecos ?? []).find(
              (x) => x.cep === pedido.endereco.cep
            ) ?? {}),
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
