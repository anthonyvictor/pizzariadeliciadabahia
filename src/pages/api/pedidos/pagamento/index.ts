import type { NextApiRequest, NextApiResponse } from "next";
import { PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { IItemPedido, IPagamentoPedido, IPagamentoPedidoPix } from "tpdb-lib";
import { v4 as uuidv4 } from "uuid";
import { createStaticPix, hasError, PixError, parsePix } from "pix-utils";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IItemPedido>>
) {
  // if (req.method === "GET") {
  //   let data;
  //   if (!req.query.qrcode) return res.status(400).end();

  //   data = await destrincharPix(req.query.qrcode as string);

  //   res.status(200).json(data);
  // } else
  if (req.method === "POST") {
    const { pedidoId, pagamentos } = req.body;
    await mudarPagamentos(pedidoId, pagamentos);
    res.status(200).end();
    // }  else if (req.method === "DELETE") {
    //   const { "itemsIds[]": itemsIds, pedidoId } = req.query;

    //   if (!pedidoId || !itemsIds?.length) return res.status(400).end();

    //   await removeItem(pedidoId as string, itemsIds as string[]);
    //   res.status(200).end();
  } else {
    res.status(405).end(); // Método não permitido
  }
}
// export const destrincharPix = (qrcode: string) => {
//   const pix = parsePix(qrcode);
//   if (!hasError(pix)) {
//   } else {
//     console.error("erro pix", pix);
//   }
// };
export const mudarPagamentos = async (
  pedidoId: string,
  pagamentos: IPagamentoPedido[]
) => {
  await conectarDB();

  await PedidosModel.findByIdAndUpdate(pedidoId, {
    pagamentos: pagamentos.map((x) => {
      const pix: IPagamentoPedidoPix = {} as IPagamentoPedidoPix;

      if (x.tipo === "pix") {
        const txid = uuidv4().replace(/-/g, "").slice(0, 10);
        const valor = Number((x.valor - (x.desconto ?? 0)).toFixed(2));
        const chave = "86160308599";

        const payload = createStaticPix({
          pixKey: chave, // chave Pix
          merchantCity: "SALVADOR",
          merchantName: "Pizzaria Delicia",
          transactionAmount: valor, // valor do pagamento
          txid, // associar ao pedido
        });

        // if (!hasError(payload)) {
        //   const brCode = payload.toBRCode();
        //   // 00020126540014br.gov.bcb.pix2532https://pix.thalesogliari.com.br5204000053039865802BR5914Thales Ogliari6009SAO PAULO62070503***63043FD3
        // }

        if (hasError(payload)) {
          const pErr = payload as PixError;
          console.error(pErr.message);
        } else {
          pix.txid = txid;

          pix.qrcode = payload.toBRCode();
          pix.status = "aguardando";
        }
      }
      return { ...x, ...pix };
    }),
  });
};
