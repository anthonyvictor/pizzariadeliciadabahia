import { IPizzaBorda } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PizzaBordasModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { sortBordas } from "@util/pizza";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaBorda>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterBorda({
        id: req.query.id as string,
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterBordas({
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterBorda = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProduto) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = (await ffid({
    m: PizzaBordasModel,
    id,
  })) as unknown as IPizzaBorda;

  if (!produtoDispPelasRegras(data, cliente, deveEstar))
    throw new HTTPError("Borda indisponível", 404);

  return data;
};

export const obterBordas = async ({
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProdutos) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = sortBordas(
    ((await ff({ m: PizzaBordasModel })) as unknown as IPizzaBorda[]).filter(
      (x) => produtoDispPelasRegras(x, cliente, deveEstar)
    )
  );

  return data;
};
