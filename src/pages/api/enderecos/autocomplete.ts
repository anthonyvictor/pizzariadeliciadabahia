// /pages/api/autocomplete.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { IEndereco } from "tpdb-lib";
// import { googleAutocomplete } from "src/infra/google/maps";
import NodeCache from "node-cache";
import { HTTPError } from "@models/error";
import {
  query_cepaberto,
  query_nominatim,
  query_photon,
} from "@util/enderecos/query";
import { cep_cepAberto } from "@util/enderecos/cep";

const memoryCache = new NodeCache({ stdTTL: 3600 }); // 1h

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

export async function autoCompleteEnderecos(termo: string) {
  const [c_cepAberto, q_cepAberto, q_nominatim, q_photon] = await Promise.all([
    cep_cepAberto(termo),
    query_cepaberto(termo),
    query_nominatim(termo),
    query_photon(termo),
  ]);
  const enderecos: IEndereco[] = [
    ...c_cepAberto,
    ...q_cepAberto,
    ...q_nominatim,
    ...q_photon,
  ];

  return enderecos;

  // const termoLower = termo.toLowerCase();

  // // 1️⃣ Cache em memória
  // const memResult = memoryCache.get(termoLower);
  // if (memResult) return memResult;

  // // 2️⃣ Busca no Mongo (apenas campos necessários para autocomplete)
  // const dbResult = await EnderecosModel.find(
  //   { $text: { $search: termoLower } },
  //   {
  //     cep: 1,
  //     logradouro: 1,
  //     bairro: 1,
  //     cidade: 1,
  //     estado: 1,
  //     latitude: 1,
  //     longitude: 1,
  //   }
  // )
  //   .limit(10)
  //   .lean();

  // if (dbResult.length > 0) {
  //   memoryCache.set(termoLower, dbResult);
  //   return dbResult;
  // }

  // // 3️⃣ Busca no Google Places API
  // const googleResult = await googleAutocomplete(termoLower);

  // // Normaliza e salva no Mongo
  // if (googleResult.length > 0) {
  //   await EnderecosModel.insertMany(googleResult, { ordered: false }).catch(
  //     () => {}
  //   );
  //   memoryCache.set(termoLower, googleResult);
  // }

  // return googleResult;
}
