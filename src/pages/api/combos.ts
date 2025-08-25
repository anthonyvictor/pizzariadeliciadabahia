import { IBebida, ICombo, ILanche, IPizzaSabor } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { CombosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { comboDispPelasRegras, produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { aplicarValorMinCombo, sortCombos } from "@util/combo";
import { populates } from "tpdb-lib";
import { HTTPError } from "@models/error";

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
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterCombos({
        _cliente: req.query.clienteId as any,
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
  _cliente,
  deveEstar = "emCondicoes",
  sabores,
  bebidas,
  lanches,
}: ObterProduto & {
  sabores?: IPizzaSabor[];
  bebidas?: IBebida[];
  lanches?: ILanche[];
}) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const _data = (await ffid({
    m: CombosModel,
    id,
    populates: populates.combos,
  })) as unknown as ICombo;

  if (!comboDispPelasRegras(_data, cliente, deveEstar))
    throw new HTTPError("Combo indisponível", 404);

  const data = [sabores, bebidas, lanches]
    .filter(Boolean)
    .some((x) => x?.length)
    ? aplicarValorMinCombo(_data, sabores, bebidas, lanches)
    : _data;

  return data;
};

export const obterCombos = async ({
  _cliente,
  deveEstar = "emCondicoes",
  sabores,
  bebidas,
  lanches,
}: ObterProdutos & {
  sabores?: IPizzaSabor[];
  bebidas?: IBebida[];
  lanches?: ILanche[];
}) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const _data = (await ff({
    m: CombosModel,

    populates: populates.combos,
  })) as unknown as ICombo[];

  const data = sortCombos(
    _data
      .filter((x) => comboDispPelasRegras(x, cliente, deveEstar))
      .map((x) =>
        [sabores, bebidas, lanches].filter(Boolean).some((x) => x?.length)
          ? aplicarValorMinCombo(x, sabores, bebidas, lanches)
          : x
      )
  );

  return data;
};
