import { conectarDB } from "src/infra/mongodb/config";
import { ICliente } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ClientesModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { normalizePhone } from "@util/enderecos/format";
import { obterCliente } from ".";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ICliente>>
) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const whatsapp = req.body.whatsapp;
    const data = await loginCliente(whatsapp);
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

export const loginCliente = async (whatsapp: string) => {
  await conectarDB();

  const filter = { whatsapp: normalizePhone(whatsapp) };

  const clienteEncontrado = await ClientesModel.findOne(filter).lean();

  if (clienteEncontrado)
    return await obterCliente(clienteEncontrado._id.toString());

  return null;
};
