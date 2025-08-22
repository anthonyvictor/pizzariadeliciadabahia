import { IPizzaEspessura } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PizzaEspessurasModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";
import { sortEspessuras } from "@util/pizza";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaEspessura>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterEspessura({
        id: req.query.id as string,
        _cliente: req.cookies.clienteId,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterEspessuras({
        _cliente: req.cookies.clienteId,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterEspessura = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProduto) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = (await ffid({
    m: PizzaEspessurasModel,
    id,
  })) as unknown as IPizzaEspessura;

  if (!produtoDispPelasRegras(data, cliente, deveEstar))
    throw new HTTPError("Espessura indisponível", 404);

  return data;
};

export const obterEspessuras = async ({
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProdutos) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = sortEspessuras(
    (
      (await ff({ m: PizzaEspessurasModel })) as unknown as IPizzaEspessura[]
    ).filter((x) => produtoDispPelasRegras(x, cliente, deveEstar))
  );

  return data;
};
