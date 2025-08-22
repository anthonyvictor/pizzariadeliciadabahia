import { IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PizzaTamanhosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";
import { aplicarValorMinTamanhos, sortTamanhos } from "@util/pizza";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaTamanho>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterTamanho({
        id: req.query.id as string,
        _cliente: req.cookies.clienteId,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterTamanhos({
        _cliente: req.cookies.clienteId,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterTamanho = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
  sabores,
}: ObterProduto & { sabores?: IPizzaSabor[] | undefined }) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const _data = (await ffid({
    m: PizzaTamanhosModel,
    id,
  })) as unknown as IPizzaTamanho;

  if (!produtoDispPelasRegras(_data, cliente, deveEstar))
    throw new HTTPError("Tamanho indisponível", 404);

  const data = aplicarValorMinTamanhos([_data], sabores)[0];

  return data as IPizzaTamanho;
};

export const obterTamanhos = async ({
  _cliente,
  deveEstar = "emCondicoes",
  sabores,
}: ObterProdutos & { sabores?: IPizzaSabor[] | undefined }) => {
  await conectarDB();
  const cliente = await obterCliente(_cliente);

  const data = sortTamanhos(
    aplicarValorMinTamanhos(
      (
        (await ff({ m: PizzaTamanhosModel })) as unknown as IPizzaTamanho[]
      ).filter((x) => produtoDispPelasRegras(x, cliente, deveEstar)),
      sabores
    )
  );

  return data as IPizzaTamanho[];
};
