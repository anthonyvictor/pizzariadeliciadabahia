import { IEndereco } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff } from "tpdb-lib";
import { EnderecosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IEndereco>>
) {
  await conectarDB();

  if (req.method === "GET") {
    const cep = req.query.cep as string | undefined;
    const q = {};
    if (cep) q["cep"] = cep;

    const data = await ff({ m: EnderecosModel, q });

    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}
