import { axiosOk } from "@util/axios";
import { logJson } from "@util/logs";
import axios, { AxiosError } from "axios";
import { format_brasilApi, format_cepAberto, format_viaCEP } from "./format";

export const cep_cepAberto = async (value: string) => {
  try {
    const v = (value ?? "").replace(/\D/g, "");
    console.log("cep_cepAberto =>", "v:", `"${v}"`, "v.length:", v.length);
    console.log(`CEPABERTO_TOKEN`, process.env.CEPABERTO_TOKEN);
    if (v.length !== 8) return [];
    const res = await axios.get(`https://www.cepaberto.com/api/v3/cep`, {
      params: { cep: v },
      headers: {
        Authorization: `Token token=${process.env.CEPABERTO_TOKEN}`,
      },
    });

    if (!axiosOk(res.status) || res?.data?.erro)
      throw new Error(`Requisição CepAberto falhou, \nurl:${res.config.url}`);

    const data = format_cepAberto(res.data);
    console.log("cep_cepAberto", res.config.url, data);
    return data;
  } catch (err) {
    console.error(`Erro no cep CepAberto`, err.message, err.stack);
    if (err instanceof AxiosError) {
      logJson(err.response?.data);
      logJson(err.message);
    }
    return [];
  }
};
export const cep_brasilApi = async (value: string) => {
  try {
    const v = (value ?? "").replace(/\D/g, "");
    console.log("v, cep", v, v.length);
    if (v.length !== 8) return [];
    const res = await axios.get(`https://brasilapi.com.br/api/cep/v2/${v}`);

    if (!axiosOk(res.status) || res?.data?.erro)
      throw new Error(`Requisição BrasilAPI falhou, \nurl:${res.config.url}`);

    const data = format_brasilApi(res.data);
    console.log("cep_brasilApi", res.config.url, data);
    return data;
  } catch (err) {
    console.error(`Erro no cep brasilApi`, err.message, err.stack);
    return [];
  }
};

export const cep_viaCep = async (value: string) => {
  try {
    const v = (value ?? "").replace(/\D/g, "");
    console.log("v, cep", v, v.length);
    if (v.length !== 8) return [];
    const res = await axios.get(`https://viacep.com.br/ws/${v}/json/`);

    if (!axiosOk(res.status) || res?.data?.erro)
      throw new Error(`Requisição ViaCEP falhou, \nurl:${res.config.url}`);

    const data = format_viaCEP(res.data);
    console.log("cep_viaCep", res.config.url, data);
    return data;
  } catch (err) {
    console.error(`Erro no cep ViaCEP`, err.message, err.stack);
    return [];
  }
};
