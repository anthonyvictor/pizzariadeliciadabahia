import type { NextApiRequest, NextApiResponse } from "next";
import { RespType } from "@util/api";
import { IItemPedidoTipo } from "tpdb-lib";
import { randomUUID } from "crypto";
import { conectarDB } from "src/infra/mongodb/config";
import { IItemBuilder, IITemBuilderCombo } from "tpdb-lib";
import { obterCombo } from "@routes/combos";
import { obterSabores } from "@routes/pizzas/sabores";
import { obterTamanho, obterTamanhos } from "@routes/pizzas/tamanhos";
import { obterExtras } from "@routes/pizzas/extras";
import { obterPontos } from "@routes/pizzas/pontos";
import { obterEspessuras } from "@routes/pizzas/espessuras";
import { obterBordas } from "@routes/pizzas/bordas";
import { obterLanche, obterLanches } from "@routes/lanches";
import { obterBebida, obterBebidas } from "@routes/bebidas";
import { NoLogError } from "@models/error";
import { obterPedido } from "@routes/pedidos";

const indsp = "Oops, esse item não está disponível no momento!";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IItemBuilder>>
) {
  if (req.method === "GET") {
    const { id, tipo, pedidoId } = req.query;
    if (!id || !tipo || !pedidoId) return res.status(400).end();

    const data = await obterItemBuilder(
      id as any,
      tipo as any,
      pedidoId as any
    );

    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterItemBuilder = async (
  id: string,
  tipo: IItemPedidoTipo | "combo",
  pedidoId: string | undefined
): Promise<IItemBuilder> => {
  await conectarDB();

  const _pedido = await obterPedido(pedidoId);

  if (tipo === "combo") {
    const bebidas = await obterBebidas({ _pedido });
    const lanches = await obterLanches({ _pedido });
    const bordas = await obterBordas({ _pedido });
    const espessuras = await obterEspessuras({ _pedido });
    const pontos = await obterPontos({ _pedido });
    const extras = await obterExtras({ _pedido });
    const sabores = await obterSabores({ _pedido });
    const tamanhos = await obterTamanhos({ _pedido, sabores });
    const combo = await obterCombo({ id, sabores, bebidas, lanches, _pedido });

    return {
      id: randomUUID(),
      tipo: "combo" as IItemPedidoTipo,
      combo,
      tamanhos,
      sabores,
      bordas,
      espessuras,
      pontos,
      extras,
      bebidas,
      lanches,
    } as unknown as IITemBuilderCombo;
  } else if (tipo === "pizza") {
    const bordas = await obterBordas({ _pedido });
    const espessuras = await obterEspessuras({ _pedido });
    const pontos = await obterPontos({ _pedido });
    const extras = await obterExtras({ _pedido });
    const sabores = await obterSabores({ _pedido });
    const tamanho = await obterTamanho({ id, _pedido, sabores });

    if (!sabores?.length) throw new NoLogError(indsp);

    return {
      id: randomUUID(),
      tipo: "pizza",
      tamanho,
      sabores,
      bordas,
      espessuras,
      pontos,
      extras,
    };
  } else if (tipo === "bebida") {
    const bebida = await obterBebida({ id, _pedido });

    return {
      id: randomUUID(),
      tipo: "bebida",
      bebida,
    };
  } else {
    const lanche = await obterLanche({ id, _pedido });

    return {
      id: randomUUID(),
      tipo: "lanche",
      lanche,
    };
  }
};
