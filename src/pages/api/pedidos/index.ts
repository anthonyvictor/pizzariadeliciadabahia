import { IEndereco, IPedido } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { populates } from "tpdb-lib";
import mongoose, { Types } from "mongoose";
import { obterDistancias } from "@routes/distancias";
import { encontrarTaxa } from "@util/distancias";
import { toArray } from "@util/array";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPedido>>
) {
  try {
    if (req.method === "GET") {
      let data;
      const { id, ids, clientesIds, status } = req.query;
      if (id) {
        data = await obterPedido(id as string);
      } else {
        data = await obterPedidos({
          clientesIds,
          status: status as any,
          ids: ids as any,
        });
      }
      res.status(200).json(data);
    } else if (req.method === "POST") {
      const { clienteId } = req.body;
      const data = await novoPedido(clienteId);
      res.status(200).send(data);
    } else if (req.method === "PATCH") {
      const { pedidoId, pedido } = req.body;
      await patchPedido(pedidoId, pedido);
      res.status(200).end();
    } else {
      res.status(405).end(); // Método não permitido
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      console.error(err.message, err.code, err.data, err.stack);
      res.status(err.code).end();
    } else {
      console.error(err.message, err.stack);
      res.status(500).end();
    }
  }
}

export const obterPedidos = async ({
  ids: _ids,
  status,
  clientesIds: _clientesIds,
}: {
  ids?: string | string[];
  status?: "emAndamento" | "enviado";
  clientesIds?: string | string[];
}) => {
  await conectarDB();
  const ids = toArray(_ids);
  const clientesIds = toArray(_clientesIds);

  const q: any = {};
  if (ids && ids.length)
    q._id = { $in: ids.map((x) => new mongoose.Types.ObjectId(x)) };
  if (clientesIds && clientesIds.length)
    q.cliente = { $in: clientesIds.map((x) => new mongoose.Types.ObjectId(x)) };
  if (status === "emAndamento") q.enviadoEm = null;
  if (status === "enviado") q.enviadoEm = { $exists: true, $ne: null };

  let pedidos = await ff({
    m: PedidosModel,
    q,
    populates: populates.pedidos,
  });

  const distancias = await obterDistancias();

  const r = pedidos.map((pedido) => {
    return {
      ...pedido,
      cliente: !pedido?.cliente
        ? undefined
        : {
            ...pedido.cliente,
            enderecos: (pedido?.cliente?.enderecos ?? []).map((endereco) => {
              const taxa = encontrarTaxa(
                endereco.enderecoOriginal.distancia_metros,
                distancias
              );

              return {
                ...endereco,
                enderecoOriginal: {
                  ...endereco.enderecoOriginal,
                  taxa:
                    endereco.enderecoOriginal.taxa != null
                      ? endereco.enderecoOriginal.taxa
                      : taxa,
                },
              };
            }),
          },
      endereco:
        pedido.tipo === "retirada"
          ? undefined
          : {
              ...pedido.endereco,
              enderecoOriginal: {
                ...pedido.endereco.enderecoOriginal,
                taxa:
                  pedido.endereco.enderecoOriginal.taxa != null
                    ? pedido.endereco.enderecoOriginal.taxa
                    : encontrarTaxa(
                        pedido.endereco.enderecoOriginal.distancia_metros,
                        distancias
                      ),
              },
            },
    };
  });

  return r;
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
  const distancias = await obterDistancias();
  const r = {
    ...pedido,
    cliente: !pedido?.cliente
      ? undefined
      : {
          ...pedido.cliente,
          enderecos: (pedido?.cliente?.enderecos ?? []).map((endereco) => {
            const taxa = encontrarTaxa(
              endereco.enderecoOriginal.distancia_metros,
              distancias
            );

            return {
              ...endereco,
              enderecoOriginal: {
                ...endereco.enderecoOriginal,
                taxa:
                  endereco.enderecoOriginal.taxa != null
                    ? endereco.enderecoOriginal.taxa
                    : taxa,
              },
            };
          }),
        },
    endereco:
      pedido.tipo === "retirada"
        ? undefined
        : {
            ...pedido.endereco,
            enderecoOriginal: {
              ...pedido.endereco.enderecoOriginal,
              taxa:
                pedido.endereco.enderecoOriginal.taxa != null
                  ? pedido.endereco.enderecoOriginal.taxa
                  : encontrarTaxa(
                      pedido.endereco.enderecoOriginal.distancia_metros,
                      distancias
                    ),
            },
          },
  };

  return r;
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
