import { IEndereco } from "tpdb-lib";
import { logJson } from "../logs";
import { axiosOk } from "../axios";
import { normalizarOrdinal, removeAccents } from "../format";
import { randomUUID } from "crypto";
import axios, { AxiosError } from "axios";
import { bboxSalvador } from "@util/dados";

// const viaCep = async (cep: string, rua?: string, _bairro?: string) => {
//   let data: any;
//   try {
//     const url = rua
//       ? `https://viacep.com.br/ws/BA/Salvador/${rua}/json/`
//       : `https://viacep.com.br/ws/${cep}/json/`;

//     const res = await axios.get(url);

//     if (!axiosOk(res.status)) throw new Error("ViaCEP falhou");

//     data = res.data;
//   } catch (err) {
//     console.error(err);
//     return undefined;
//   }

//   if (data.erro) throw new Error("CEP inválido");

//   const filtrarMesmoBairro = (d: any[] | any) =>
//     Array.isArray(d)
//       ? (d.filter((x) => x.bairro === _bairro) as any[])
//       : (d as any);

//   data = _bairro
//     ? filtrarMesmoBairro(data)?.length
//       ? filtrarMesmoBairro(data)
//       : data
//     : data;

//   data = Array.isArray(data) && data.length ? data[0] : data;

//   return {
//     cep: data.cep.replace(/\D/g, ""),
//     rua: data.logradouro,
//     bairro: data.bairro,
//     cidade: data.localidade,
//     estado: data.uf,
//   };
// };

export const viaCep = async (
  cep: string,
  rua?: string,
  _bairro?: string,
  tentativa: number = 1
): Promise<
  | {
      cep: string;
      rua: string;
      bairro: string;
      cidade: string;
      estado: string;
    }
  | undefined
> => {
  let url: string;

  // Definir URL baseado na tentativa
  if (rua && tentativa === 1) {
    url = `https://viacep.com.br/ws/BA/Salvador/${encodeURIComponent(
      normalizarOrdinal(rua)
    )}/json/`;
  } else if (rua && tentativa === 2) {
    url = `https://viacep.com.br/ws/BA/Salvador/${encodeURIComponent(
      rua
    )}/json/`;
  } else {
    url = `https://viacep.com.br/ws/${cep}/json/`;
  }

  try {
    const res = await axios.get(url);

    if (!axiosOk(res.status)) throw new Error("ViaCEP falhou");

    let data: any = res.data;

    if (data.erro) throw new Error("CEP inválido");

    data = Array.isArray(res.data) ? res.data : [res.data];

    const filtrarMesmoBairro = (d: any[]) =>
      d.filter((x) =>
        !_bairro
          ? true
          : removeAccents(String(x.bairro).toLowerCase()) ===
            removeAccents(String(_bairro).toLowerCase())
      ) as any[];
    const peloBairro = filtrarMesmoBairro(data);

    data = peloBairro?.length ? peloBairro : data;

    data = Array.isArray(data) && data.length ? data[0] : data;

    return {
      cep: data.cep.replace(/\D/g, ""),
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };
  } catch (err) {
    // fallback recursivo
    if (tentativa < 3) return viaCep(cep, rua, _bairro, tentativa + 1);

    console.error("ViaCEP falhou em todas as tentativas", err);
    return undefined;
  }
};

export async function obterEnderecoComDistancia(
  _cep: string,
  origemLat: number,
  origemLon: number,
  modo:
    | "cycling-regular"
    | "cycling-electric"
    | "driving-motorcycle"
    | "driving-car"
    | "driving-hgv"
    | "foot-walking" = "driving-car",
  // = "cycling-regular",
  _rua?: string,
  _bairro?: string
): Promise<IEndereco> {
  // 1. Buscar endereço no BrasilAPI

  let rua: string;
  let bairro: string;
  let cidade: string;
  let estado: string;
  let cep: string;
  try {
    let res;
    // res = await brasilApi(cep, 2);
    // if (!res) res = await brasilApi(cep, 1);
    if (!res) res = await viaCep(_cep, _rua, _bairro);

    cep = res.cep;
    rua = res.rua;
    bairro = res.bairro;
    cidade = res.cidade;
    estado = res.estado;

    if (!res) throw new Error("APIs de CEP falharam!");
  } catch (err) {
    console.error(err.message, err.stack);
    throw new Error("CEP inválido");
  }

  // 2. Buscar coordenadas no Nominatim
  const fullAddress = `${rua}, ${bairro}, ${cidade} - ${estado}`;

  const locationResp = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: fullAddress,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "cep-coordenadas-app/1.0",
      },
    }
  );

  if (!locationResp.data?.length) {
    throw new Error("Coordenadas não encontradas para o endereço.");
  }

  const destinoLat = parseFloat(locationResp.data[0].lat);
  const destinoLon = parseFloat(locationResp.data[0].lon);

  // 3. Calcular rota com OpenRouteService
  const ORS_API_KEY = process.env.ORS_API_KEY!;
  const rotaResp = await axios.post(
    `https://api.openrouteservice.org/v2/directions/${modo}`,
    {
      coordinates: [
        [origemLon, origemLat],
        [destinoLon, destinoLat],
      ],
    },
    {
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  logJson(rotaResp.data);
  const rota = rotaResp.data.routes[0];
  const distancia = rota.summary.distance;
  const duracao = rota.summary.duration;
  const obj = {
    cep,
    rua,
    bairro,
    cidade,
    estado,
    lat: destinoLat,
    lon: destinoLon,
    distancia_metros: distancia,
    duracao_segundos: duracao,
  };
  return obj as IEndereco;
}
