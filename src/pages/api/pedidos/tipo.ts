import type { NextApiRequest, NextApiResponse } from "next";
import { IEnderecoPedido, PedidosModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { IPedido, IPedidoTipo } from "tpdb-lib";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPedido>>
) {
  if (req.method != "POST") return res.status(405).end(); // Método não permitido

  const { pedidoId, novoTipo, novoEndereco } = req.body;
  await mudarTipoEEndereco(pedidoId, novoTipo, novoEndereco);
  res.status(200).end();
}

export const mudarTipoEEndereco = async (
  pedidoId: string,
  novoTipo: IPedidoTipo,
  novoEndereco: IEnderecoPedido
) => {
  await conectarDB();
  const endereco =
    novoTipo === "entrega"
      ? { ...novoEndereco, enderecoOriginal: novoEndereco.enderecoOriginal.id }
      : undefined;
  await PedidosModel.findByIdAndUpdate(
    pedidoId,
    { tipo: novoTipo, endereco } // Só adiciona se não existir
  );
};
