import { IPizzaExtra } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PizzaExtrasModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";
import { sortExtras } from "@util/pizza";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaExtra>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterExtra({
        id: req.query.id as string,
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterExtras({
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterExtra = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProduto) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = (await ffid({
    m: PizzaExtrasModel,
    id,
  })) as unknown as IPizzaExtra;

  if (!produtoDispPelasRegras(data, cliente, deveEstar))
    throw new HTTPError("Extra indisponível", 404);

  return data;
};

export const obterExtras = async ({
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProdutos) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = sortExtras(
    ((await ff({ m: PizzaExtrasModel })) as unknown as IPizzaExtra[]).filter(
      (x) => produtoDispPelasRegras(x, cliente, deveEstar)
    )
  );

  return data;
};
