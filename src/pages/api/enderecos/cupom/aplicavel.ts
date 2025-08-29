import { cupomAplicavel } from "@util/enderecos";
import type { NextApiRequest, NextApiResponse } from "next";
import { ICupom, IEndereco } from "tpdb-lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { cupom, endereco } = req.body;

    if (!endereco?.cep || !endereco?.rua || !endereco?.bairro)
      return res.status(400).end();

    const cliente = await cupomAplicavel(cupom, endereco);

    return res.status(200).json(cliente);
  } catch (error) {
    console.error("Erro ao adicionar endereço:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
