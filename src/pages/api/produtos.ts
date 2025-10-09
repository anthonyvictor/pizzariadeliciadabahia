import type { NextApiRequest, NextApiResponse } from "next";
import { RespType } from "@util/api";
import { IBebida, ILanche, IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";
import { obterTamanhos } from "@routes/pizzas/tamanhos";
import { obterSabores } from "@routes/pizzas/sabores";
import { obterLanches } from "@routes/lanches";
import { obterBebidas } from "@routes/bebidas";
import { obterPedido } from "@routes/pedidos";
import { sortDisp } from "@util/array";

// Função handler da rota

interface IProdutos {
  tamanhos: IPizzaTamanho[];
  sabores: IPizzaSabor[];
  bebidas: IBebida[];
  lanches: ILanche[];
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IProdutos>>
) {
  if (req.method === "GET") {
    const data = await obterProdutos();
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterProdutos = async () => {
  await conectarDB();

  const bebidas = sortDisp(await obterBebidas({ _pedido: undefined }));
  const lanches = sortDisp(await obterLanches({ _pedido: undefined }));
  const sabores = sortDisp(await obterSabores({ _pedido: undefined }));
  const tamanhos = sortDisp(
    (await obterTamanhos({ _pedido: undefined, sabores })).sort(
      (a, b) => b.valorMin - a.valorMin
    )
  );

  return {
    sabores,
    bebidas,
    lanches,
    tamanhos,
  } as unknown as IProdutos;
};
