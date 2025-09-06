import type { NextApiRequest, NextApiResponse } from "next";
import { IEndereco } from "tpdb-lib";
import NodeCache from "node-cache";
import { HTTPError } from "@models/error";

import {
  pos_cepaberto,
  pos_nominatim,
  pos_photon,
} from "@util/enderecos/reverse";

const memoryCache = new NodeCache({ stdTTL: 3600 }); // 1h

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { lat, lon } = req.query;

    const results = await reverseEnderecos(lat as any, lon as any);
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

export async function reverseEnderecos(lat: number, lon: number) {
  const [cepaberto, nominatim, photon] = await Promise.all([
    pos_cepaberto([lat, lon]),
    pos_nominatim([lat, lon]),
    pos_photon([lat, lon]),
  ]);
  const enderecos: IEndereco[] = [...cepaberto, ...nominatim, ...photon];

  return enderecos;
}
