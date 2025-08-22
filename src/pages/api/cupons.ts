import { ICupom } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { CuponsModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortCupons } from "@util/cupons";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ICupom>>
) {
  if (req.method === "GET") {
    let data;
    if (req.query.id) {
      data = await obterCupom({
        id: req.query.id as string,
        _cliente: req.cookies.clienteId,
        deveEstar: req.query.deveEstar as any,
      });
    } else {
      data = await obterCupons({
        _cliente: req.cookies.clienteId,
        codigo: req.query.codigo as any,
        deveEstar: req.query.deveEstar as any,
      });
    }
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterCupom = async ({
  id,
  _cliente,
  deveEstar = "emCondicoes",
}: ObterProduto) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);

  const data = (await ffid({ m: CuponsModel, id })) as unknown as ICupom;

  if (!produtoDispPelasRegras(data, cliente, deveEstar))
    throw new HTTPError("Cupom indisponível", 404);

  return data;
};

export const obterCupons = async ({
  _cliente,
  codigo,
  deveEstar = "emCondicoes",
}: ObterProdutos & { codigo?: string }) => {
  await conectarDB();

  const cliente = await obterCliente(_cliente);
  const q: any = {};

  if (!!codigo && typeof codigo === "string") {
    q.codigo = codigo;
  }
  const data = sortCupons(
    ((await ff({ m: CuponsModel, q })) as unknown as ICupom[]).filter((x) =>
      produtoDispPelasRegras(x, cliente, deveEstar)
    )
  );

  const comRegras = data.map((x) =>
    deveEstar === "emCondicoes"
      ? {
          ...x,
          condicoes: (x.condicoes ?? []).filter((y) => y.ativa),
          excecoes: (x.excecoes ?? []).filter((y) => y.ativa),
        }
      : x
  );

  return comRegras;
};
