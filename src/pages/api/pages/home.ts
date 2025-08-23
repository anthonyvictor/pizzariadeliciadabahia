import type { NextApiRequest, NextApiResponse } from "next";
import { ffid } from "tpdb-lib";
import { ClientesModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { IHome } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";
import { parse } from "cookie";
import { obterCombos } from "@routes/combos";
import { obterTamanhos } from "@routes/pizzas/tamanhos";
import { obterSabores } from "@routes/pizzas/sabores";
import { obterLanches } from "@routes/lanches";
import { obterBebidas } from "@routes/bebidas";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IHome>>
) {
  if (req.method === "GET") {
    if (!req.query.clienteId) return res.status(400).end();
    const data = await obterHome(req.query.clienteId as any);
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterHome = async (clienteId: string | undefined) => {
  await conectarDB();
  const cliente = await ffid({ m: ClientesModel, id: clienteId });
  const _cliente = cliente;

  const bebidas = await obterBebidas({ _cliente });
  const lanches = await obterLanches({ _cliente });
  const sabores = await obterSabores({ _cliente });
  const tamanhos = await obterTamanhos({ _cliente, sabores });
  const combos = await obterCombos({ sabores, bebidas, lanches, _cliente });

  return {
    combos,
    bebidas,
    lanches,
    tamanhos,
    cliente,
  } as unknown as IHome;
};
