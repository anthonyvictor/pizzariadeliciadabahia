import { IBebida } from "tpdb-lib";
import { sortDisp } from "./array";

export const abreviarBebida = (bebida: string, abreviarMaximo = false) => {
  let res = bebida.replace(/(SUCO|REFRIGERANTE|CERVEJA|ENERG(É|E)TICO) /gi, "");

  if (abreviarMaximo) {
    res = res
      .replace(/LARANJA/gi, "LAR.")
      .replace(/GUARANÁ/gi, "GUAR.")
      .replace(/ANTÁRCTICA/gi, "ANTÁRCT.")
      .replace(/FRUTAS CÍTRICAS/gi, "FT.CT.");
  }

  return res;
};

export const sortBebidas = (bebidas: IBebida[] | undefined) => {
  if (!bebidas) return [];
  const r = sortDisp(
    bebidas
      .sort((a, b) => a.vendidos - b.vendidos)
      .map((x) => ({ ...x, tipo: "bebida" }))
      .reverse()
  );

  return r as IBebida[];
};

export const destrincharBebida = (nome: string) => {
  const tamanhoRegex = new RegExp(
    /\b\d+(?:[.,]\d+)?\s*(?:ml|l(?:itros?|ts?)?)\b/gi
  );
  const tamanho = tamanhoRegex.test(nome) ? nome.match(tamanhoRegex)[0] : "";
  const completoRegex = new RegExp(
    /água mineral|água com gás|suco natural|café/gi
  );

  if (completoRegex.test(nome))
    return {
      completo: nome.match(completoRegex)[0].replace(tamanhoRegex, "").trim(),
      tamanho,
    };

  const tipoRegex = new RegExp(
    /\b(água tônica|bebida mista|refrigerante|energético|cerveja|suco)\b/gi
  );

  const tipo = tipoRegex.test(nome) ? nome.match(tipoRegex)[0] : "";

  const sabor = nome.replace(tipoRegex, "").replace(tamanhoRegex, "").trim();

  return {
    tamanho,
    tipo,
    sabor,
  };
};
