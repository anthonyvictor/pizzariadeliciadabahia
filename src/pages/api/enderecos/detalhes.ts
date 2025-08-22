// /pages/api/endereco-detalhes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { EnderecosModel } from "tpdb-lib";
import {
  googlePlaceDetails,
  googleDistanceMatrix,
} from "src/infra/google/maps";

const memoryCache = new Map<string, any>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { placeId, cep } = req.query as { placeId: string; cep: string };
  if (!placeId && !cep)
    return res.status(400).json({ error: "Faltando placeId ou cep" });

  const enderecoCompleto = await obterDetalhesEndereco(placeId, cep);

  res.json(enderecoCompleto);
}

export const obterDetalhesEndereco = async (placeId: string, cep: string) => {
  const cacheKey = placeId || cep;
  if (memoryCache.has(cacheKey)) {
    const enderecoCompleto = memoryCache.get(cacheKey);
    return enderecoCompleto;
  }

  // 1️⃣ Busca no banco por CEP
  if (cep) {
    const dbEndereco = await EnderecosModel.findOne({ cep }).lean();
    if (dbEndereco) {
      memoryCache.set(cacheKey, dbEndereco);
      return dbEndereco;
    }
  }

  // 2️⃣ Busca no Google
  const details = await googlePlaceDetails(placeId as string);
  const cepFormatado = (
    details.address_components.find((c) => c.types.includes("postal_code"))
      ?.long_name || ""
  ).replace(/\D/g, "");
  const rua =
    details.address_components.find((c) => c.types.includes("route"))
      ?.long_name || "";
  const bairro =
    details.address_components.find(
      (c) => c.types.includes("sublocality") || c.types.includes("political")
    )?.long_name || "";
  const cidade =
    details.address_components.find((c) =>
      c.types.includes("administrative_area_level_2")
    )?.long_name || "";
  const estado =
    details.address_components.find((c) =>
      c.types.includes("administrative_area_level_1")
    )?.short_name || "";

  // obter distancia e tempo pelo google matrix (com custo)
  const distancia = await googleDistanceMatrix(
    details.geometry.location.lat,
    details.geometry.location.lng
  );

  // ou pelo openrouteservice (bike/moto)
  // const rota = await calcularRota(origemLat, origemLng, endereco.latitude, endereco.longitude);

  const enderecoCompleto = {
    cep: cepFormatado,
    rua,
    bairro,
    cidade,
    estado,
    lat: details.geometry.location.lat,
    lon: details.geometry.location.lng,
    distancia_metros: distancia.distance?.value,
    distancia_tempo: distancia.duration?.value,
  };

  // 3️⃣ Salva no banco e no cache
  await EnderecosModel.create(enderecoCompleto);
  memoryCache.set(cacheKey, enderecoCompleto);
};
