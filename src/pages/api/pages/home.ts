import type { NextApiRequest, NextApiResponse } from "next";
import { RespType } from "@util/api";
import { IHome } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";
import { obterCombos } from "@routes/combos";
import { obterTamanhos } from "@routes/pizzas/tamanhos";
import { obterSabores } from "@routes/pizzas/sabores";
import { obterLanches } from "@routes/lanches";
import { obterBebidas } from "@routes/bebidas";
import { obterPedido } from "@routes/pedidos";
import { sortDisp } from "@util/array";
import { sleep } from "@util/misc";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IHome>>
) {
  if (req.method === "GET") {
    if (!req.query.pedidoId) return res.status(400).end();

    const data = await obterHome(req.query.pedidoId as any);
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterHome = async (pedidoId: string | undefined) => {
  await conectarDB();

  const _pedido = await obterPedido(pedidoId);

  const bebidas = sortDisp(await obterBebidas({ _pedido }));
  const lanches = sortDisp(await obterLanches({ _pedido }));
  const sabores = sortDisp(await obterSabores({ _pedido }));
  const tamanhos = sortDisp(await obterTamanhos({ _pedido, sabores })).sort(
    (a, b) => b.valorMin - a.valorMin
  );
  const combos = sortDisp(
    await obterCombos({
      sabores,
      tamanhos,
      bebidas,
      lanches,
      _pedido,
    })
  ).sort((a, b) => b.vendidos - a.vendidos);

  return {
    combos,
    bebidas,
    lanches,
    tamanhos,
  } as unknown as IHome;
};
