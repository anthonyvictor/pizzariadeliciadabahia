import axios from "axios";
import { bboxSalvador } from "@util/dados";
import { normalizarOrdinal } from "@util/format";
import { axiosOk } from "@util/axios";
import {
  format_cepAberto,
  format_nominatim,
  format_photon,
  format_viaCEP,
} from "./format";

export const query_viaCep = async (value: string) => {
  try {
    const v = (value ?? "").trim();

    if (!v.replace(/\s/g, "").length) return [];
    if (v.replace(/\D/g, "").length === 8) return [];
    const res = await axios.get(
      `https://viacep.com.br/ws/BA/Salvador/${encodeURIComponent(
        normalizarOrdinal(v)
      )}/json/`
    );

    if (!axiosOk(res.status) || res?.data?.erro)
      throw new Error(`Requisição ViaCEP falhou, \nurl:${res.config.url}`);

    const data = format_viaCEP(res.data);
    return data;
  } catch (err) {
    console.error(`Erro na pesquisa ViaCEP`, err.message, err.stack);
    return [];
  }
};

export const query_nominatim = async (value: string, limit = 5) => {
  try {
    const v = (value ?? "").trim();
    if (!v.replace(/\s/g, "").length) return [];
    if (v.replace(/\D/g, "").length === 8) return [];
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: v,
        format: "json",
        limit,
        viewbox: bboxSalvador,
        addressdetails: 1,
        bounded: 1,
      },
    });

    if (!axiosOk(res.status))
      throw new Error(`Requisição Nominatim falhou, \nurl:${res.config.url}`);

    const data = format_nominatim(res.data);
    return data;
  } catch (err) {
    console.error(`Erro na pesquisa Nominatim`, err.message, err.stack);
    return [];
  }
};
export const query_photon = async (value: string, limit = 5) => {
  try {
    const v = (value ?? "").trim();
    if (!v.replace(/\s/g, "").length) return [];
    if (v.replace(/\D/g, "").length === 8) return [];
    const res = await axios.get(`https://photon.komoot.io/api`, {
      params: {
        q: v,
        limit,
        bbox: bboxSalvador,
        lang: "en",
        layer: "street",
      },
      headers: {
        "User-Agent": "site-pdb/1.0.0",
      },
    });

    if (!axiosOk(res.status))
      throw new Error(`Requisição Photon falhou, \nurl:${res.config.url}`);

    const data = format_photon(res.data);
    return data;
  } catch (err) {
    console.error(`Erro na pesquisa Photon`, err.message, err.stack);
    return [];
  }
};

export const query_cepaberto = async (
  value: string,
  bairro?: string,
  limit = 5
) => {
  try {
    const v = (value ?? "").trim();

    // const url = `https://www.cepaberto.com/api/v3/address?estado=BA&cidade=`
    if (!v.replace(/\s/g, "").length) return [];
    if (v.replace(/\D/g, "").length === 8) return [];
    const res = await axios.get(`https://www.cepaberto.com/api/v3/address`, {
      params: {
        estado: "BA",
        cidade: "Salvador",
        bairro: bairro,
        logradouro: v,
      },
      headers: {
        Authorization: `Token token=${process.env.CEPABERTO_TOKEN}`,
      },
    });

    if (!axiosOk(res.status))
      throw new Error(`Requisição CepAberto falhou, \nurl:${res.config.url}`);

    const data = format_cepAberto(res.data);
    return data;
  } catch (err) {
    console.error(`Erro na pesquisa CepAberto`, err.message, err.stack);
    return [];
  }
};
