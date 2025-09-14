import { ICupom } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { CuponsModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortCupons } from "@util/cupons";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { obterPedido } from "./pedidos";
import { deve_estar, dvEst } from "@models/deveEstar";
import { analisarRegras } from "@util/regras";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ICupom>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterCupom({
        id: req.query.id as string,
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterCupons({
        _pedido: req.query.pedidoId as any,
        codigo: req.query.codigo as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterCupom = async ({
  id,
  _pedido,
  deveEstar = dvEst.visivel,
}: ObterProduto) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const data = (await ffid({ m: CuponsModel, id })) as unknown as ICupom;

  return {
    ...data,
    emCondicoes: (() => {
      const { v } = analisarRegras({ item: data, pedido });
      return v;
    })(),
  };
};

export const obterCupons = async ({
  _pedido,
  codigo,
  ignorar,
  deveEstar = dvEst.tudo,
}: ObterProdutos & { codigo?: string }) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);
  const q: any = {};

  if (!!codigo && typeof codigo === "string") {
    q.codigo = codigo;
  }

  const data = sortCupons(
    deve_estar(
      (
        (await ff({
          m: CuponsModel,
          q,
        })) as unknown as ICupom[]
      ).map((x) => ({
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

  // const comRegras = data
  //   .map((x) =>
  //     deveEstar.emCondicoes
  //       ? x
  //         ? {
  //             ...x,
  //             condicoes: (x?.condicoes ?? []).filter((y) => y.ativa),
  //             excecoes: (x?.excecoes ?? []).filter((y) => y.ativa),
  //           }
  //         : x
  //       : undefined
  //   )
  //   .filter(Boolean);

  // return comRegras;
};
