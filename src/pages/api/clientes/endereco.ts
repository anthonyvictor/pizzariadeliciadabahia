import type { NextApiRequest, NextApiResponse } from "next";
import { ClientesModel, ff } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";
import { IEndereco } from "tpdb-lib";
import { EnderecosModel } from "tpdb-lib";
import { obterEnderecoExtra } from "@util/enderecos";
import { normalizarOrdinal } from "@util/format";
import { HTTPError } from "@models/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { clienteId, novoEndereco } = req.body;

    if (!clienteId || !novoEndereco) {
      return res
        .status(400)
        .json({ error: "clienteId e endereco são obrigatórios" });
    }

    await adicionarEnderecoAoCliente(clienteId, novoEndereco);

    return res.status(200).end();
  } catch (error) {
    console.error("Erro ao adicionar endereço:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function adicionarEnderecoAoCliente(
  clienteId: string,
  novoEndereco: IEndereco
) {
  await conectarDB();

  const enderecosEncontrados = await ff({
    m: EnderecosModel,
    q: { rua: normalizarOrdinal(novoEndereco.rua) },
  });

  let enderecoExtra = enderecosEncontrados?.[0];

  if (!enderecoExtra) {
    enderecoExtra = await obterEnderecoExtra(novoEndereco);

    await EnderecosModel.create({ ...enderecoExtra, taxa: undefined });

    console.info(
      `📦 Novo endereço salvo: ${enderecoExtra.cep} - ${enderecoExtra.rua} - ${enderecoExtra.bairro}`
    );
  }

  if (!enderecoExtra)
    throw new HTTPError(
      "Dados extras do endereço não encontrados para salvar no cliente",
      404,
      novoEndereco
    );

  const enderecoFinal = { ...novoEndereco, ...enderecoExtra };

  const { cep, numero, local, referencia } = enderecoFinal;

  await ClientesModel.findByIdAndUpdate(clienteId, {
    $push: { enderecos: { cep, numero, local, referencia } },
  });
}
