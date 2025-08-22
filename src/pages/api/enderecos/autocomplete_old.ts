// /pages/api/autocomplete.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { EnderecosModel } from "tpdb-lib";
import { googleAutocomplete, googlePlaceDetails } from "src/infra/google/maps";
import { HTTPError } from "@models/error";

const memoryCache = new Map<string, any>(); // TTL pode ser implementado

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { query } = req.query;

    const results = await autoCompleteEnderecos(query as string);
    res.json(results);
  } catch (err) {
    console.error(err.message, err.stack);
    if (err instanceof HTTPError) {
      res.status(err.code).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
}

const autoCompleteEnderecos = async (query: string) => {
  if (!query || typeof query !== "string")
    throw new HTTPError("Faltando query", 400);

  // 1️⃣ Busca no cache em memória
  if (memoryCache.has(query)) {
    const enderecosMemoryCache = memoryCache.get(query);
    return enderecosMemoryCache;
  }

  // 2️⃣ Busca no banco EnderecosModel por rua ou cep parecido
  const dbMatches = await EnderecosModel.find({
    rua: { $regex: query, $options: "i" },
  })
    .limit(5)
    .lean();

  if (dbMatches.length) {
    memoryCache.set(query, dbMatches);
    return dbMatches;
  }

  // 3️⃣ Busca no Google Autocomplete
  const predictions = await googleAutocomplete(query);
  const results = [];

  for (const p of predictions) {
    const details = await googlePlaceDetails(p.place_id);

    const cep = (
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

    results.push({
      cep,
      rua,
      bairro,
      cidade,
      estado,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    });
  }

  memoryCache.set(query, results);
};
