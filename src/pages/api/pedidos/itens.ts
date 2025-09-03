import type { NextApiRequest, NextApiResponse } from "next";
import {
  BebidasModel,
  CombosModel,
  ffid,
  IBebida,
  ILanche,
  IPizzaExtra,
  IPizzaTamanho,
  LanchesModel,
  PizzaExtrasModel,
  PizzaTamanhosModel,
} from "tpdb-lib";
import { PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { IItemPedido, IItemPedidoIds } from "tpdb-lib";
import { obterPedido } from ".";
import mongoose, { Model } from "mongoose";

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
  type Vendidos = { id: string; qtd: number };
  const _combosVendidos: { grupoId: string; comboId: string }[] = [];
  const _tamanhos: Vendidos[] = [];
  const _extras: Vendidos[] = [];
  const _bebidas: Vendidos[] = [];
  const _lanches: Vendidos[] = [];

  itens.forEach((item) => {
    //adiciona unicamente o combo do produto a lista de combos vendidos
    if (item.comboId) {
      const i = _combosVendidos.findIndex((x) => x.grupoId === item.grupoId);
      if (i === -1)
        _combosVendidos.push({ grupoId: item.grupoId, comboId: item.comboId });
    }

    if (item.tipo === "pizza") {
      const { tamanho, extras } = item;
      (extras ?? []).forEach((e) => {
        const i = _extras.findIndex((x) => x.id === e);
        if (i > -1) {
          _extras[i].qtd += 1;
        } else {
          _extras.push({ id: e, qtd: 1 });
        }
      });

      const i = _tamanhos.findIndex((x) => x.id === tamanho);
      if (i > -1) {
        _tamanhos[i].qtd += 1;
      } else {
        _tamanhos.push({ id: tamanho, qtd: 1 });
      }
    } else if (item.tipo === "bebida") {
      const i = _bebidas.findIndex((x) => x.id === item.bebidaOriginal);
      if (i > -1) {
        _bebidas[i].qtd += 1;
      } else {
        _bebidas.push({ id: item.bebidaOriginal, qtd: 1 });
      }
    } else if (item.tipo === "lanche") {
      const i = _lanches.findIndex((x) => x.id === item.lancheOriginal);
      if (i > -1) {
        _lanches[i].qtd += 1;
      } else {
        _lanches.push({ id: item.lancheOriginal, qtd: 1 });
      }
    }
  });
  const combos = (() => {
    const arr: Vendidos[] = [];
    _combosVendidos.forEach((item) => {
      const i = arr.findIndex((x) => x.id === item.comboId);
      if (i > -1) {
        arr[i].qtd += 1;
      } else {
        arr.push({ id: item.comboId, qtd: 1 });
      }
    });

    return arr;
  })();

  (async () => {
    try {
      // const update = async (arr: Vendidos[], m: Model<any>) => {
      //   if (arr.length) {
      //     await m.bulkWrite(
      //       arr.map((u) => {
      //       return  ({
      //         updateOne: {
      //           filter: { _id: new mongoose.Types.ObjectId(u.id) },
      //           update: { $inc: { vendidos: u.qtd },  },
      //         },
      //       })

      //       })
      //     );
      //   }
      // };

      const update = async (arr: Vendidos[], m: Model<any>) => {
        if (arr.length) {
          await m.bulkWrite(
            arr.map((u) => ({
              updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(u.id) },
                update: [
                  {
                    $set: {
                      vendidos: {
                        $add: [{ $ifNull: ["$vendidos", 0] }, u.qtd],
                      },
                      estoque: {
                        $cond: {
                          if: { $gt: ["$estoque", null] }, // só mexe se estoque existe
                          then: {
                            $max: [{ $subtract: ["$estoque", u.qtd] }, 0],
                          },
                          else: "$estoque", // mantém undefined/null
                        },
                      },
                    },
                  },
                ],
              },
            }))
          );
        }
      };

      await update(_tamanhos, PizzaTamanhosModel);
      await update(_extras, PizzaExtrasModel);
      await update(_bebidas, BebidasModel);
      await update(_lanches, LanchesModel);
      await update(combos, CombosModel);
    } catch (err) {
      console.error(
        "A atualização de vendas falhou",
        "\n--\n--",
        err.message,
        "\n--\n--",
        err.stack
      );
    }
  })();
};

export const obterItens = async (pedidoId: string) => {
  await conectarDB();
  const pedido = await obterPedido(pedidoId);
  const data = pedido.itens;

  return data;
};
