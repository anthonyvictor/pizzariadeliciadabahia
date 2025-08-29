import type { NextApiRequest, NextApiResponse } from "next";
import { conectarDB } from "src/infra/mongodb/config";
import { IEndereco } from "tpdb-lib";
import { obterDistancia } from "@util/enderecos";
import { enderecoPizzaria } from "@util/dados";
import { query_cepaberto, query_nominatim } from "@util/enderecos/query";
import { cep_cepAberto } from "@util/enderecos/cep";
import { normalizarOrdinal } from "@util/format";
import { HTTPError } from "@models/error";
import { obterDistancias } from "@routes/distancias";
import { encontrarTaxa } from "@util/distancias";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { endereco } = req.body;

    if (!endereco?.cep || !endereco?.rua || !endereco?.bairro)
      return res.status(400).end();

    const taxa = await obterTaxa(endereco);

    return res.status(200).json(taxa);
  } catch (error) {
    console.error("Erro ao adicionar endereço:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function obterTaxa(endereco: IEndereco) {
  await conectarDB();

  const temCoords = (e: IEndereco) => !!(e?.lat && e?.lon);

  endereco = temCoords(endereco)
    ? endereco
    : await query_cepaberto(
        normalizarOrdinal(endereco.rua),
        endereco.bairro
      )?.[0];

  if (!temCoords(endereco))
    endereco = await query_nominatim(
      `${normalizarOrdinal(endereco.rua)} ${endereco.bairro}`
    )?.[0];

  if (!temCoords(endereco)) endereco = await cep_cepAberto(endereco.cep)?.[0];

  if (!temCoords(endereco))
    throw new HTTPError(
      "Oops, não foi possível carregar a taxa de entrega",
      404,
      {
        message: "Coordenadas do endereço não encontradas",
        endereco,
      }
    );

  const { distancia_metros } = await obterDistancia(endereco.lat, endereco.lon);

  const distancias = await obterDistancias();

  const taxa = encontrarTaxa(distancia_metros, distancias);

  return taxa;
}
