import { IBebida, ICombo, ILanche, IPizzaSabor } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { CombosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { aplicarValorMinCombo, sortCombos } from "@util/combo";
import { populates } from "tpdb-lib";
import { analisarRegras } from "@util/regras";
import { obterPedido } from "./pedidos";
import { deve_estar, dvEst } from "@models/deveEstar";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ICombo>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterCombo({
        id: req.query.id as string,
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterCombos({
        _pedido: req.query.pedidoId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterCombo = async ({
  id,
  _pedido,
  sabores,
  bebidas,
  lanches,
}: ObterProduto & {
  sabores?: IPizzaSabor[];
  bebidas?: IBebida[];
  lanches?: ILanche[];
}) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  let data = (await ffid({
    m: CombosModel,
    id,
    populates: populates.combos,
  })) as unknown as ICombo;

  const trouxeProdutos = [sabores, bebidas, lanches]
    .filter(Boolean)
    .some((x) => x?.length);

  data = trouxeProdutos
    ? aplicarValorMinCombo(data, sabores, bebidas, lanches)
    : data;
  return {
    ...data,
    emCondicoes: (() => {
      const { v } = analisarRegras({ item: data, pedido });
      return v;
    })(),
  };
};

export const obterCombos = async ({
  _pedido,
  ignorar,
  deveEstar = dvEst.visivel,
  sabores,
  bebidas,
  lanches,
}: ObterProdutos & {
  sabores?: IPizzaSabor[];
  bebidas?: IBebida[];
  lanches?: ILanche[];
}) => {
  await conectarDB();

  const pedido = await obterPedido(_pedido);

  const trouxeProdutos = [sabores, bebidas, lanches]
    .filter(Boolean)
    .some((x) => x?.length);

  const data = sortCombos(
    deve_estar(
      (
        (await ff({
          m: CombosModel,
          populates: populates.combos,
        })) as unknown as ICombo[]
      )
        .map((x) => ({
          ...x,
          emCondicoes: (() => {
            const { v } = analisarRegras({ item: x, pedido, ignorar });
            return v;
          })(),
        }))
        .map((x) =>
          trouxeProdutos
            ? aplicarValorMinCombo(x, sabores, bebidas, lanches)
            : x
        ),
      deveEstar
    )
  );
  return data;
};
