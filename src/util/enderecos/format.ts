import { normalizarOrdinal } from "@util/format";
import { randomUUID } from "crypto";
import { IEndereco } from "tpdb-lib";

export const format_photon = (data: any) => {
  const _enderecos = ((data.features as any[]) || [])
    .filter((e) => !!e?.properties?.postcode && !!e?.geometry)
    .map((e) => ({
      id: e.properties.osm_id,
      rua: normalizarOrdinal(e.properties.formatted || e.properties.name),
      cep: e.properties.postcode.replace(/\D/g, ""),
      bairro:
        e.properties.locality || e.properties.suburb || e.properties.district,
      cidade: e.properties.city,
      estado: e.properties.state,
      lon: e.geometry[0],
      lat: e.geometry[1],
    })) as IEndereco[];

  return _enderecos;
};

export const format_nominatim = (data: any) => {
  data = Array.isArray(data) ? data : [data];

  const _enderecos = (data || [])
    .filter((e) => !!e?.address?.postcode && !!e?.lat)
    .map((e) => ({
      id: e.osm_id ?? randomUUID(),
      rua: normalizarOrdinal(e.address.road || e.name),
      cep: e.address.postcode.replace(/\D/g, ""),
      bairro:
        e.address.suburb ||
        e.address.neighbourhood ||
        e.address.quarter ||
        e.address.city_district,
      cidade: e.address.city,
      estado: e.address.state,
      lon: e.lon,
      lat: e.lat,
    })) as IEndereco[];

  return _enderecos;
};
export const format_viaCEP = (data: any) => {
  data = Array.isArray(data) ? data : [data];

  const _enderecos = (data || [])
    .filter((e) => !!e?.cep)
    .map((e) => ({
      cep: e.cep.replace(/\D/g, ""),
      rua: normalizarOrdinal(e.logradouro),
      bairro: e.bairro,
      cidade: e.localidade,
      estado: e.estado,
      id: randomUUID(),
      lon: e.lon,
      lat: e.lat,
    })) as IEndereco[];

  return _enderecos;

  //   const filtrarMesmoBairro = (d: any[]) =>
  //   d.filter((x) =>
  //     !_bairro
  //       ? true
  //       : removeAccents(String(x.bairro).toLowerCase()) ===
  //         removeAccents(String(_bairro).toLowerCase())
  //   ) as any[];
  // const peloBairro = filtrarMesmoBairro(data);

  // data = peloBairro?.length ? peloBairro : data;
};
export const format_brasilApi = (data: any) => {
  data = Array.isArray(data) ? data : [data];

  const _enderecos = (data || [])
    .filter((e) => !!e?.cep)
    .map((e) => ({
      cep: e.cep.replace(/\D/g, ""),
      rua: normalizarOrdinal(e.street),
      bairro: e.neighborhood,
      cidade: e.city,
      estado: e.estado,
      id: randomUUID(),
      lon: e.lon,
      lat: e.lat,
    })) as IEndereco[];

  return _enderecos;
};
export const format_cepAberto = (data: any) => {
  data = Array.isArray(data) ? data : [data];

  const _enderecos = (data || [])
    .filter((e) => !!e?.cep)
    .map((e) => ({
      cep: e.cep.replace(/\D/g, ""),
      rua: normalizarOrdinal(e.logradouro),
      bairro: e.bairro,
      cidade: e.cidade.nome,
      estado: e.estado.nome ?? e.estado.sigla,
      id: randomUUID(),
      lon: e.longitude,
      lat: e.latitude,
    })) as IEndereco[];

  return _enderecos;
};
