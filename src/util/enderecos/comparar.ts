import { normalizarOrdinal } from "@util/format";
import jaroWinkler from "jaro-winkler";

const tipos = [
  "rua",
  "avenida",
  "av",
  "travessa",
  "estrada",
  "rodovia",
  "praça",
  "beco",
];

function normalizar(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/\./g, "")
    .trim();
}

function separarEndereco(endereco: string) {
  const norm = normalizarOrdinal(normalizar(endereco));
  const partes = norm.split(" ");
  const tipo = tipos.find((t) => norm.startsWith(t)) || "";
  const nome = tipo ? norm.replace(tipo, "").trim() : norm;
  return { tipo, nome };
}

export function enderecosParecidos(a: string, b: string, limiar = 0.9) {
  const ea = separarEndereco(a);
  const eb = separarEndereco(b);

  const similaridadeNome = jaroWinkler(ea.nome, eb.nome);

  if (similaridadeNome >= limiar) {
    return true;
  }
  return false;
}
