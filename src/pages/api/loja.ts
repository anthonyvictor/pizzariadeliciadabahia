import type { NextApiRequest, NextApiResponse } from "next";
import { ff } from "tpdb-lib";
import { RespType } from "@util/api";
import { LojaModel } from "tpdb-lib";
import { ILoja } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ILoja>>
) {
  await conectarDB();

  if (req.method === "GET") {
    let data = (await ff({ m: LojaModel }))?.[0];
    if (!data) {
      data = await LojaModel.create({ closedUntil: undefined });
    }
    res.status(200).json(data);
  } else if (req.method === "PATCH") {
    const closedUntil = req.body.closedUntil;
    const data = await LojaModel.find().exec();
    let result = data?.[0];
    if (!result) {
      result = await LojaModel.create({ closedUntil });
    } else {
      await LojaModel.findByIdAndUpdate(result._id, { closedUntil });
    }
  } else if (req.method === "DELETE") {
    await LojaModel.updateMany(
      { closedUntil: { $exists: true, $gte: new Date() } },
      { $unset: { closedUntil: "" } }
    ).exec();
  } else {
    res.status(405).end(); // Método não permitido
  }
}
