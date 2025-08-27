import axios from "axios";
import { axiosOk } from "@util/axios";
import { format_cepAberto, format_nominatim, format_photon } from "./format";

export const pos_photon = async (pos: [number, number], limit = 5) => {
  try {
    console.log("pos", pos, "photon");
    const res = await axios.get(`https://photon.komoot.io/reverse`, {
      params: {
        lat: pos[0],
        lon: pos[1],
        layer: "street",
        limit,
      },
    });

    if (!axiosOk(res.status))
      throw new Error(`Requisição photon falhou, \nurl:${res.config.url}`);

    const data = format_photon(res.data);
    console.log("pos_photon", res.config.url, data);
    return data;
  } catch (err) {
    console.error(`Erro na posicao photon`, err.message, err.stack);
    return [];
  }
};

export const pos_cepaberto = async (pos: [number, number], limit = 5) => {
  console.log("pos", pos, "cepaberto");
  try {
    const res = await axios.get(`https://www.cepaberto.com/api/v3/nearest`, {
      params: {
        lat: pos[0],
        lng: pos[1],
      },
      headers: {
        Authorization: `Token token=${process.env.CEPABERTO_TOKEN}`,
      },
    });

    if (!axiosOk(res.status))
      throw new Error(`Requisição CepAberto falhou, \nurl:${res.config.url}`);

    const data = format_cepAberto(res.data);
    console.log("pos_cepAberto", res.config.url, data);
    return data;
  } catch (err) {
    console.error(`Erro na posicao CepAberto`, err.message, err.stack);
    return [];
  }
};
export const pos_nominatim = async (pos: [number, number], limit = 5) => {
  console.log("pos", pos, "nominatim");

  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: "json",
        addressdetails: 1,
        lat: pos[0],
        lon: pos[1],
      },
    });

    if (!axiosOk(res.status))
      throw new Error(`Requisição Nominatim falhou, \nurl:${res.config.url}`);

    const data = format_nominatim(res.data);
    console.log("pos_nominatim", res.config.url, data);
    return data;
  } catch (err) {
    console.error(`Erro na posicao Nominatim`, err.message, err.stack);
    return [];
  }
};
