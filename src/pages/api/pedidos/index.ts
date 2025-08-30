import { IEndereco, IPedido } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { populates } from "tpdb-lib";
import mongoose, { Types } from "mongoose";
import { obterCliente, obterClientes } from "@routes/clientes";
import { obterDistancias } from "@routes/distancias";
import { encontrarTaxa } from "@util/distancias";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPedido>>
) {
  if (req.method === "GET") {
    let data;
    const { id, ids } = req.query;
    if (id) {
      data = await obterPedido(id as string);
    } else {
      data = await obterPedidos({
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
}

export const obterPedidos = async ({
  ids,
}: {
  ids?: string[];
  clientesIds?: string[];
}) => {
  await conectarDB();

  const q: any = {};
  if (ids && ids.length)
    q._id = { $in: ids.map((x) => new mongoose.Types.ObjectId(x)) };

  let pedidos = await ff({
    m: PedidosModel,
    q,
    populates: populates.pedidos,
  });

  const distancias = await obterDistancias();

  const r = pedidos.map((pedido) => {
    return {
      ...pedido,
      cliente: {
        ...pedido.cliente,
        enderecos: pedido.cliente.enderecos.map((endereco) => {
          const taxa = encontrarTaxa(
            endereco.enderecoOriginal.distancia_metros,
            distancias
          );

          console.log("taxaaaaaaaaaaaaaaaaaaaaa", taxa);
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

  const distancias = await obterDistancias();
  console.log(pedido.endereco);

  const r = {
    ...pedido,
    cliente: {
      ...pedido.cliente,
      enderecos: pedido.cliente.enderecos.map((endereco) => {
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

  console.log(r);
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
