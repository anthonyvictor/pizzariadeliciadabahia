import { IBebida } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { BebidasModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortBebidas } from "@util/bebidas";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IBebida>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterBebida({
        id: req.query.id as string,
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterBebidas({
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterBebida = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProduto) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = (await ffid({ m: BebidasModel, id })) as unknown as IBebida;

  if (!produtoDispPelasRegras(data, cliente, deveEstar))
    throw new HTTPError("Bebida indisponível", 404);

  return data;
};

export const obterBebidas = async ({
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProdutos) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = sortBebidas(
    ((await ff({ m: BebidasModel })) as unknown as IBebida[]).filter((x) =>
      produtoDispPelasRegras(x, cliente, deveEstar)
    )
  );

  return data;
};
