import { IBairro } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff } from "tpdb-lib";
import { BairrosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IBairro>>
) {
  if (req.method === "GET") {
    const data = await obterBairros();

    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterBairros = async () => {
  await conectarDB();
  const data = (await ff({ m: BairrosModel })).sort((a, b) =>
    a.nome > b.nome ? 1 : -1
  ) as IBairro[];

  return data;
};
