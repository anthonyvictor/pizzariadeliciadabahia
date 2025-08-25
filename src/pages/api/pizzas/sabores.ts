import { IPizzaSabor } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PizzaSaboresModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";
import { aplicarValorMedSabores, sortSabores } from "@util/pizza";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaSabor>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterSabor({
        id: req.query.id as string,
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterSabores({
        _cliente: req.query.clienteId as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterSabor = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProduto) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const _data = (await ffid({
    m: PizzaSaboresModel,
    id,
  })) as unknown as IPizzaSabor;

  if (!produtoDispPelasRegras(_data, cliente, deveEstar))
    throw new HTTPError("Sabor indisponível", 404);

  const data = aplicarValorMedSabores([_data]);

  return data;
};

export const obterSabores = async ({
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProdutos) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = sortSabores(
    aplicarValorMedSabores(
      ((await ff({ m: PizzaSaboresModel })) as unknown as IPizzaSabor[]).filter(
        (x) => produtoDispPelasRegras(x, cliente, deveEstar)
      )
    )
  );

  return data;
};
