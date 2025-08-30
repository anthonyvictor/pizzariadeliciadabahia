import { ICliente, populates } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ffid } from "tpdb-lib";
import { ClientesModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { comboDispPelasRegras, produtoDispPelasRegras } from "@util/regras";
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

const indsp = "Oops, esse item não está disponível no momento!";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IItemBuilder>>
) {
  if (req.method === "GET") {
    const { id, tipo, clienteId } = req.query;
    if (!id || !tipo || !clienteId) return res.status(400).end();

    const data = await obterItemBuilder(
      id as any,
      tipo as any,
      clienteId as any
    );

    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterItemBuilder = async (
  id: string,
  tipo: IItemPedidoTipo | "combo",
  clienteId: string | undefined
): Promise<IItemBuilder> => {
  await conectarDB();
  const cliente = (await ffid({
    m: ClientesModel,
    id: clienteId,
    populates: populates.clientes,
  })) as unknown as ICliente;
  const _cliente = cliente;

  if (tipo === "combo") {
    const bebidas = await obterBebidas({ _cliente });
    const lanches = await obterLanches({ _cliente });
    const bordas = await obterBordas({ _cliente });
    const espessuras = await obterEspessuras({ _cliente });
    const pontos = await obterPontos({ _cliente });
    const extras = await obterExtras({ _cliente });
    const sabores = await obterSabores({ _cliente });
    const tamanhos = await obterTamanhos({ _cliente, sabores });
    const combo = await obterCombo({ id, sabores, bebidas, lanches, _cliente });

    if (!comboDispPelasRegras(combo, cliente)) {
      throw new NoLogError(indsp);
    }

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
    const bordas = await obterBordas({ _cliente });
    const espessuras = await obterEspessuras({ _cliente });
    const pontos = await obterPontos({ _cliente });
    const extras = await obterExtras({ _cliente });
    const sabores = await obterSabores({ _cliente });
    const tamanho = await obterTamanho({ id, _cliente, sabores });

    if (sabores.every((x) => !x.disponivel || !x.visivel))
      throw new NoLogError(indsp);

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
    const bebida = await obterBebida({ id, _cliente });

    if (!produtoDispPelasRegras(bebida, cliente)) throw new NoLogError(indsp);

    if (!bebida || !bebida.disponivel || !bebida.visivel)
      throw new NoLogError(indsp);

    return {
      id: randomUUID(),
      tipo: "bebida",
      bebida,
    };
  } else {
    const lanche = await obterLanche({ id, _cliente });

    if (!produtoDispPelasRegras(lanche, cliente)) throw new NoLogError(indsp);

    if (!lanche || !lanche.disponivel || !lanche.visivel)
      throw new NoLogError(indsp);

    return {
      id: randomUUID(),
      tipo: "lanche",
      lanche,
    };
  }
};
