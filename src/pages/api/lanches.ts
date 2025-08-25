import { ILanche } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { LanchesModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortLanches } from "@util/lanches";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ICliente } from "tpdb-lib";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ILanche>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterLanche({
        id: req.query.id as string,
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterLanches({
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterLanche = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProduto) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = (await ffid({ m: LanchesModel, id })) as unknown as ILanche;

  if (!produtoDispPelasRegras(data, cliente, deveEstar))
    throw new HTTPError("Lanche indisponível", 404);
  return data;
};

export const obterLanches = async ({
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProdutos) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = sortLanches(
    ((await ff({ m: LanchesModel })) as unknown as ILanche[]).filter((x) =>
      produtoDispPelasRegras(x, cliente, deveEstar)
    )
  );

  return data;
};
