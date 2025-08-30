import { IEndereco } from "tpdb-lib";
import { logJson } from "../logs";
import { axiosOk } from "../axios";
import { normalizarOrdinal, removeAccents } from "../format";
import axios from "axios";
import { enderecoPizzaria } from "@util/dados";
import { query_cepaberto, query_nominatim, query_photon } from "./query";
import { cep_cepAberto } from "./cep";
import { semelhanca } from "@util/misc";
import { HTTPError } from "@models/error";
import { enderecosParecidos } from "./comparar";
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

// export async function obterEnderecoComDistancia(
//   _cep: string,
//   origemLat: number,
//   origemLon: number,
//   modo:
//     | "cycling-regular"
//     | "cycling-electric"
//     | "driving-motorcycle"
//     | "driving-car"
//     | "driving-hgv"
//     | "foot-walking" = "driving-car",
//   // = "cycling-regular",
//   _rua?: string,
//   _bairro?: string
// ): Promise<IEndereco> {
//   // 1. Buscar endereço no BrasilAPI

//   let rua: string;
//   let bairro: string;
//   let cidade: string;
//   let estado: string;
//   let cep: string;
//   try {
//     let res;
//     // res = await brasilApi(cep, 2);
//     // if (!res) res = await brasilApi(cep, 1);
//     if (!res) res = await viaCep(_cep.replace(/\D/g, ""), _rua, _bairro);

//     cep = res.cep;
//     rua = res.rua;
//     bairro = res.bairro;
//     cidade = res.cidade;
//     estado = res.estado;

//     if (!res) throw new Error("APIs de CEP falharam!");
//   } catch (err) {
//     console.error(err.message, err.stack);
//     throw new Error("CEP inválido");
//   }

//   // 2. Buscar coordenadas no Nominatim
//   const fullAddress = `${rua}, ${bairro}, ${cidade} - ${estado}`;

//   const locationResp = await axios.get(
//     "https://nominatim.openstreetmap.org/search",
//     {
//       params: {
//         q: fullAddress,
//         format: "json",
//         limit: 1,
//       },
//       headers: {
//         "User-Agent": "cep-coordenadas-app/1.0",
//       },
//     }
//   );

//   if (!locationResp.data?.length) {
//     throw new Error("Coordenadas não encontradas para o endereço.");
//   }

//   const destinoLat = parseFloat(locationResp.data[0].lat);
//   const destinoLon = parseFloat(locationResp.data[0].lon);

//   // 3. Calcular rota com OpenRouteService
//   const ORS_API_KEY = process.env.ORS_API_KEY!;
//   const rotaResp = await axios.post(
//     `https://api.openrouteservice.org/v2/directions/${modo}`,
//     {
//       coordinates: [
//         [origemLon, origemLat],
//         [destinoLon, destinoLat],
//       ],
//     },
//     {
//       headers: {
//         Authorization: ORS_API_KEY,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   logJson(rotaResp.data);
//   const rota = rotaResp.data.routes[0];
//   const distancia = rota.summary.distance;
//   const duracao = rota.summary.duration;
//   const obj = {
//     cep,
//     rua,
//     bairro,
//     cidade,
//     estado,
//     lat: destinoLat,
//     lon: destinoLon,
//     distancia_metros: distancia,
//     duracao_segundos: duracao,
//   };
//   return obj as IEndereco;
// }

type ModoORS =
  | "cycling-regular"
  | "cycling-electric"
  | "driving-motorcycle"
  | "driving-car"
  | "driving-hgv"
  | "foot-walking";

export async function obterDistancia(
  lat: number | string,
  lon: number | string,
  modo: ModoORS = "foot-walking"
) {
  const ORS_API_KEY = process.env.ORS_API_KEY!;
  const rotaResp = await axios.post(
    `https://api.openrouteservice.org/v2/directions/${modo}`,
    {
      coordinates: [
        [enderecoPizzaria.lon, enderecoPizzaria.lat],
        [lon, lat],
      ],
    },
    {
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const rota = rotaResp.data.routes?.[0];
  if (!rota)
    throw new HTTPError("Oops, não foi possível obter a distância", 404, {
      lat,
      lon,
    });
  const distancia_metros = rota.summary.distance;
  const duracao_segundos = rota.summary.duration;

  return { distancia_metros, duracao_segundos };
}

export async function obterEnderecoExtra(
  enderecoOriginal: IEndereco
): Promise<IEndereco> {
  // 1. Buscar endereço no BrasilAPI

  const compararSemelhanca = (
    endOrig: IEndereco,
    endFin: IEndereco,
    metodo: string
  ) => {
    if (!endFin) return null;
    const ehIgual = enderecosParecidos(endOrig.rua, endFin.rua);
    if (!ehIgual) {
      console.info(
        `[ metodo: ${metodo} ] Ruas diferentes:`,

        `\n- ${endOrig.rua}`,
        `\n- ${endFin.rua}`
      );
      return null;
    } else {
      return endFin;
    }
  };

  if (enderecoOriginal.lat && enderecoOriginal.lon) {
    if (enderecoOriginal.distancia_metros) {
      return enderecoOriginal;
    } else {
      return {
        ...enderecoOriginal,
        ...(await obterDistancia(enderecoOriginal.lat, enderecoOriginal.lon)),
      };
    }
  } else if (!enderecoOriginal?.cep || !enderecoOriginal.rua) {
    throw new HTTPError(
      "Endereço não especificado para obter dados extras! Faltando cep ou nome da rua",
      400,
      enderecoOriginal
    );
  }

  let enderecoExtra: IEndereco = null;

  const obterGeoLoc = async () => {
    if (!enderecoExtra) {
      enderecoExtra = await query_cepaberto(
        enderecoOriginal.rua,
        enderecoOriginal.bairro
      )?.[0];

      enderecoExtra = compararSemelhanca(
        enderecoExtra,
        enderecoOriginal,
        "query_cepAberto"
      );
    }

    if (!enderecoExtra) {
      enderecoExtra = await cep_cepAberto(enderecoOriginal.cep)?.[0];
      enderecoExtra = compararSemelhanca(
        enderecoExtra,
        enderecoOriginal,
        "cep_cepAberto"
      );
    }

    const qnom = async (str: string) => {
      enderecoExtra = await query_nominatim(str)?.[0];
      enderecoExtra = compararSemelhanca(
        enderecoExtra,
        enderecoOriginal,
        `query_nominatim`
      );
    };
    const qpho = async (str: string) => {
      enderecoExtra = await query_photon(str)?.[0];
      enderecoExtra = compararSemelhanca(
        enderecoExtra,
        enderecoOriginal,
        `query_photon`
      );
    };

    if (!enderecoExtra) {
      await qnom(`${enderecoOriginal.rua}, ${enderecoOriginal.bairro}`);
    }

    if (!enderecoExtra) {
      await qnom(enderecoOriginal.rua);
    }
    if (!enderecoExtra) {
      await qpho(`${enderecoOriginal.rua}, ${enderecoOriginal.bairro}`);
    }

    if (!enderecoExtra) {
      await qpho(enderecoOriginal.rua);
    }

    if (!enderecoExtra)
      throw new HTTPError(
        "Coordenadas não encontradas para o endereço.",
        404,
        enderecoOriginal
      );
  };

  await obterGeoLoc();

  const { distancia_metros, duracao_segundos } = await obterDistancia(
    enderecoExtra.lat,
    enderecoExtra.lon
  );

  const cep = (enderecoExtra?.cep ?? enderecoOriginal.cep)?.replace?.(
    /\D/g,
    ""
  );

  const enderecoFinal = {
    ...enderecoOriginal,
    ...enderecoExtra,
    distancia_metros,
    duracao_segundos,
    cep,
  };

  return enderecoFinal;
}
