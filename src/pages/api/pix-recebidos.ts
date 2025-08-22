import { IPixRecebido } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PedidosModel, PixRecebidoModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortPixRecebidos } from "@util/pix";
import { IPagamentoPedidoPix } from "tpdb-lib";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPixRecebido>>
) {
  if (req.method === "GET") {
    let data: IPixRecebido | IPixRecebido[] | null = null;
    if (req.query.id) {
      data = await obterPixRecebido(req.query.id as string);
    } else {
      data = await obterPixRecebidos(req.query);
    }
    res.status(200).json(data);
  } else if (req.method === "POST") {
    await novoPixRecebido(req.body.pix);
    res.status(200).end();
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterPixRecebido = async (id: string) => {
  await conectarDB();

  const data = (await ffid({
    m: PixRecebidoModel,
    id,
  })) as unknown as IPixRecebido;

  return data;
};

export const obterPixRecebidos = async ({ limite }: { limite?: number }) => {
  await conectarDB();

  const pixRecebidos = sortPixRecebidos(
    (
      (await ff({
        m: PixRecebidoModel,
        s: { criadoEm: -1 },
        l: limite ?? 30,
      })) as unknown as IPixRecebido[]
    ).filter((x) => true)
  );

  return pixRecebidos;
};

export const novoPixRecebido = async (pix: IPixRecebido) => {
  await conectarDB();

  const novoPix = await PixRecebidoModel.create({
    ...pix,
    criadoEm: new Date(),
  });

  return novoPix;
};
