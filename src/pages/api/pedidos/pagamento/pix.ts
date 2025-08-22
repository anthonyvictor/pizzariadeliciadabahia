import { IPixRecebido } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { PedidosModel, PixRecebidoModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { sortPixRecebidos } from "@util/pix";
import { IPagamentoPedidoPix } from "tpdb-lib";
import { removeAccents } from "@util/format";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<boolean>>
) {
  try {
    if (req.method === "GET") {
      const data = await verificarPixAguardando(req.query as any);

      res.status(200).json(data);
    } else {
      res.status(405).end(); // Método não permitido
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      res.status(err.code).end();
    } else {
      res.status(500).end();
    }
  }
}

export const verificarPixAguardando = async ({
  pix,
  pedido,
}: {
  pix: string;
  pedido: string;
}) => {
  await conectarDB();

  let pixRecebidos = sortPixRecebidos(
    (await ff({
      m: PixRecebidoModel,
      s: { criadoEm: -1 },
      q: { pagamentoId: null },
      l: 5,
    })) as unknown as IPixRecebido[]
  );

  const q = {} as any;
  if (pedido) q._id = pedido;
  let pixAguardando: IPagamentoPedidoPix | undefined = (
    await ffid({
      m: PedidosModel,
      id: pedido,
    })
  )?.pagamentos?.find((x) => x.id === pix) as IPagamentoPedidoPix;

  if (!pixAguardando || !pixAguardando.qrcode || !pixAguardando.txid) {
    throw new HTTPError(
      "Oops, Não encontramos o pix do seu pedido no sistema!",
      404
    );
  } else if (pixAguardando.status !== "aguardando") {
    // atualiza o pix aguardando para pago/pendente no bd e retorna o status
    return true;
  } else if (pixAguardando.status === "aguardando") {
    const encontrado = pixRecebidos.find((rcbd) => {
      const valorPixAguardando =
        pixAguardando.valor - (pixAguardando.desconto ?? 0);

      const valorIgual = rcbd.valor === valorPixAguardando;

      return (
        valorIgual && rcbd.criadoEm.getTime() > pixAguardando.criadoEm.getTime()
      );
    });

    if (encontrado) {
      await PixRecebidoModel.findByIdAndUpdate(encontrado.id, {
        $set: {
          pagamentoId: pix,
        },
      });

      let res: any = await PedidosModel.updateOne(
        { "pagamentos._id": pix },
        {
          $set: {
            "pagamentos.$.status": "pago",
            "pagamentos.$.pagoEm": new Date(),
          },
        }
      );
    }
    return !!encontrado;
  }
};
