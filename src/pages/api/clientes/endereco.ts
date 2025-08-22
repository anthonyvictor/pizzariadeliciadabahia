import type { NextApiRequest, NextApiResponse } from "next";
import { ClientesModel } from "tpdb-lib";
import { conectarDB } from "src/infra/mongodb/config";
import { IEndereco } from "tpdb-lib";
import { EnderecosModel } from "tpdb-lib";
import { obterEnderecoComDistancia } from "@util/enderecos";
import { enderecoPizzaria } from "@util/dados";

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

    const cliente = await adicionarEnderecoAoCliente(clienteId, novoEndereco);

    return res.status(200).json(cliente);
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

  const cepRaw = novoEndereco.cep || "";
  let cepLimpo = cepRaw.replace(/\D/g, ""); // Apenas dígitos do CEP

  // Verifica se o cep já existe
  const existente = await EnderecosModel.findOne({
    rua: novoEndereco.rua,
  }).lean();

  if (!existente) {
    try {
      const info = await obterEnderecoComDistancia(
        cepLimpo,
        enderecoPizzaria.lat, // sua origem, pode ser ajustável
        enderecoPizzaria.lon,
        "driving-hgv",
        novoEndereco.rua,
        novoEndereco.bairro
      );

      cepLimpo = info?.cep?.replace?.(/\D/g, "") ?? cepLimpo;
      const result = await EnderecosModel.create({
        ...info,
        cep: cepLimpo,
      });

      console.info(
        `📦 Novo endereço salvo: ${cepLimpo} - ${novoEndereco.rua} - ${novoEndereco.bairro}`
      );
    } catch (err) {
      console.error(`❌ Erro ao salvar endereço ${cepLimpo}:`, err);
    }
  } else {
    cepLimpo = existente?.cep?.replace(/\D/g, "") ?? cepLimpo;
  }

  const enderecoCliente = {
    cep: cepLimpo,
    numero: novoEndereco.numero,
    local: novoEndereco.local,
    referencia: novoEndereco.referencia,
  };

  const clienteAtualizado = await ClientesModel.findByIdAndUpdate(
    clienteId,
    {
      $push: { enderecos: enderecoCliente },
    },
    {
      new: true, // retorna o cliente atualizado
    }
  ).lean();

  if (!clienteAtualizado) {
    throw new Error("Cliente não encontrado.");
  }

  return clienteAtualizado;
}
