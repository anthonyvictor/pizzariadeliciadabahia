import type { NextApiRequest, NextApiResponse } from "next";
import { ClientesModel, ff, ffid, IEnderecoCliente } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";
import { EnderecosModel } from "tpdb-lib";
import { obterEnderecoExtra } from "@util/enderecos";
import { normalizarOrdinal } from "@util/format";
import { HTTPError } from "@models/error";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { clienteId, novoEndereco } = req.body;

      if (!clienteId || !novoEndereco || !novoEndereco?.enderecoOriginal?.rua) {
        return res.status(400).json({
          error: "clienteId e endereço, com endereço original são obrigatórios",
        });
      }

      await adicionarEnderecoAoCliente(clienteId, novoEndereco);

      return res.status(200).end();
    } else if (req.method === "DELETE") {
      const { enderecoId, clienteId } = req.query;
      if (!enderecoId || !clienteId)
        throw new HTTPError("Precisa do id do cliente e do endereço", 404);
      await desativarEnderecoDoCliente(
        clienteId as string,
        enderecoId as string
      );
      return res.status(200).end();
    } else {
      return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro ao adicionar endereço:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function adicionarEnderecoAoCliente(
  clienteId: string,
  novoEndereco: IEnderecoCliente
) {
  await conectarDB();

  const enderecosEncontrados = await ff({
    m: EnderecosModel,
    q: {
      rua: normalizarOrdinal(novoEndereco.enderecoOriginal.rua),
    },
  });

  let enderecoOriginal = enderecosEncontrados?.[0];

  if (!enderecoOriginal) {
    const enderecoExtra = await obterEnderecoExtra(
      novoEndereco.enderecoOriginal
    );

    const res = await EnderecosModel.create({
      ...enderecoExtra,
      taxa: undefined,
    });

    enderecoOriginal = await ffid({
      m: EnderecosModel,
      id: res._id.toString(),
    });

    console.info(
      `📦 Novo endereço salvo: ${enderecoOriginal.cep} - ${enderecoOriginal.rua} - ${enderecoOriginal.bairro}`
    );
  }

  if (!enderecoOriginal)
    throw new HTTPError(
      "Dados extras do endereço não encontrados para salvar no cliente",
      404,
      novoEndereco
    );

  const { numero, local, referencia } = novoEndereco;

  await ClientesModel.findByIdAndUpdate(clienteId, {
    $push: {
      enderecos: {
        numero,
        local,
        referencia,
        enderecoOriginal: enderecoOriginal.id,
      },
    },
  });
}

export async function desativarEnderecoDoCliente(
  clienteId: string,
  enderecoId: string
) {
  await conectarDB();

  const cliente = await ffid({
    m: ClientesModel,
    id: clienteId,
  });

  if (
    !cliente ||
    !cliente?.enderecos?.length ||
    !cliente.enderecos.find((x) => x.id === enderecoId)
  )
    throw new HTTPError("Endereço não encontrado", 404, cliente);

  await ClientesModel.updateOne(
    {
      _id: new Types.ObjectId(clienteId),
      "enderecos._id": new Types.ObjectId(enderecoId),
    },
    { $set: { "enderecos.$.visivel": false } }
  );
}
