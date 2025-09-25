import type { NextApiRequest, NextApiResponse } from "next";
import { RespType } from "@util/api";
import { IHome } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";
import { obterCombos } from "@routes/combos";
import { obterTamanhos } from "@routes/pizzas/tamanhos";
import { obterSabores } from "@routes/pizzas/sabores";
import { obterLanches } from "@routes/lanches";
import { obterBebidas } from "@routes/bebidas";
import { sortDisp } from "@util/array";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IHome>>
) {
  if (req.method === "GET") {
    const data = await obterStories();
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterStories = async () => {
  await conectarDB();

  const bebidas = sortDisp(await obterBebidas({ _pedido: undefined }));
  const lanches = sortDisp(await obterLanches({ _pedido: undefined }));
  const sabores = sortDisp(await obterSabores({ _pedido: undefined }));
  const tamanhos = sortDisp(
    await obterTamanhos({ _pedido: undefined, sabores })
  );
  const combos = sortDisp(
    await obterCombos({
      sabores,
      tamanhos,
      bebidas,
      lanches,
      _pedido: undefined,
    })
  )
    .sort((a, b) => b.vendidos - a.vendidos)
    .filter(
      (x) => x.visivel && x.disponivel && x.emCondicoes && x.estoque !== 0
    );

  return {
    combos,
    bebidas,
    lanches,
    tamanhos,
  } as unknown as IHome;
};
