import type { NextApiRequest, NextApiResponse } from "next";
import { ff } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { IDistancia } from "tpdb-lib";
import { DistanciasModel } from "tpdb-lib";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IDistancia>>
) {
  if (req.method === "GET") {
    const data = await obterDistancias();
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const { de, ate, taxa } = req.body;
    const data = await createDistancia(de, ate, taxa);
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterDistancias = async () => {
  await conectarDB();

  const data = await ff({ m: DistanciasModel });
  return data;
};

export const createDistancia = async (
  de: number,
  ate: number,
  taxa: number
) => {
  const data = await DistanciasModel.create({ de, ate, taxa });
  return data;
};
