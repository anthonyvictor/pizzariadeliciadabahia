export const getValueString = ({
  name,
  value,
}: {
  name: string;
  value: number;
}) => `${name}: ${formatCurrency(value)}`;

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export const formatCurrency = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export const removeAccents = (txt: string) => {
  const r = String(txt)
    .replace(/[ÀÁÂÃÄÅ]/g, "A")
    .replace(/[Ç]/g, "C")
    .replace(/[ÈÉÊË]/g, "E")
    .replace(/[ÌÍÎÏ]/g, "I")
    .replace(/[ÒÓÔÕÖ]/g, "O")
    .replace(/[ÙÚÛÜ]/g, "U")

    .replace(/[àáâãäå]/g, "a")
    .replace(/[ç]/g, "c")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .trim();
  return r;
};

import { informacoesLocais } from "./local";
import { startsWith } from "./misc";

export function formatNumber(valor: string) {
  return valor.replace(/[^0-9]/gi, "");
}

// function formatPhoneNumber(
//   valor,
//   manterDDD,
//   manterDDI = false,
//   manter9 = true
// ) {
//   if (!valor) return ''
//   // Remove the Country code
//   valor = valor.replace('+55', '')
//   valor =
//     valor.startsWith('55') && valor.length > 11
//       ? valor.replace(/^(55)/, '')
//       : valor
//   if (valor.startsWith('+')) return valor

//   valor = valor.slice(0, 1) === '0' ? valor.slice(1, valor.length) : valor
//   valor = formatNumber(valor)
//   let _ddd, _num, _ddi
//   _ddi = manterDDI ? '+55' : ''
//   const nove = manter9 ? '9' : ''
//   switch (valor.length) {
//     case 11: //00 90000-0000
//       _ddd = valor.slice(0, 2)
//       _ddd = manterDDD === true || _ddd !== MyDDD ? _ddd + ' ' : ''
//       _num = nove + valor.slice(3, 7) + '-' + valor.slice(7)
//       break
//     case 10: //00 0000-0000
//       _ddd = valor.slice(0, 2)
//       _ddd = manterDDD === true || _ddd !== MyDDD ? _ddd + ' ' : ''
//       _num = nove + valor.slice(2, 6) + '-' + valor.slice(6)
//       break
//     case 9: //90000-0000
//       _ddd = manterDDD === true ? MyDDD + ' ' : ''
//       _num = nove + valor.slice(1, 5) + '-' + valor.slice(5)
//       break
//     case 8: //0000-0000
//       _ddd = manterDDD === true ? MyDDD + ' ' : ''
//       _num = nove + valor.slice(0, 4) + '-' + valor.slice(4)
//       break
//     default:
//       _ddd = ''
//       _num = valor
//       break
//   }

//   valor = _ddi + _ddd + _num
//   return valor
// }

export const formatRua = (rua: string) => {
  return rua
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace("LAD", "LADEIRA")
    .replace("AV", "AVENIDA")
    .replace(/\b(R)\b/g, "RUA")
    .replace(/\b(DR)\b/g, "DOUTOR")
    .replace(/\b(LADEIRA DO ZOOLOGICO)\b/g, "LADEIRA DO JARDIM ZOOLOGICO")
    .replace(/\b(MANUEL RANGEL)\b/g, "MANOEL RANGEL")
    .replace(/\b(BIAO)\b/g, "TRAVESSA ASSEMBLEIA DE DEUS")
    .replace(/\s\s/g, " ")
    .trim();
};

export function formatPhoneNumber(
  valor: string,
  manterDDD: boolean = true,
  manterDDI: boolean = true
) {
  let novoValor = valor;

  // Remove the Country code BRASILEIRO.
  novoValor = novoValor.replace("+55", "");

  //Se o Country code não for Brasileiro, retorna o número sem formatação.
  if (startsWith(novoValor, ["+", "0800"])) return novoValor;

  //Remove qualquer caracter especial
  novoValor = formatNumber(novoValor);

  //Remove o primeiro caracter caso o mesmo seja "0"
  if (novoValor[0] === "0") novoValor = novoValor.substring(1);

  let _ddd, _num, _ddi;
  _ddi = informacoesLocais.DDI + " ";
  _ddd = informacoesLocais.DDD + " ";

  switch (novoValor.length) {
    case 11: //00 90000-0000
      _ddd = novoValor.slice(0, 2) + " ";
      _num = novoValor.slice(2, 7) + "-" + novoValor.slice(7);
      break;
    case 10: //00 0000-0000
      _ddd = novoValor.slice(0, 2) + " ";
      _num = novoValor.slice(2, 6) + "-" + novoValor.slice(6);
      _num = startsWith(_num, ["9", "8", "7", "6", "1"]) ? "9" + _num : _num;
      break;
    case 9: //90000-0000
      _num = novoValor.slice(0, 5) + "-" + novoValor.slice(5);
      break;
    case 8: //0000-0000
      _num = novoValor.slice(0, 4) + "-" + novoValor.slice(4);
      _num = startsWith(_num, ["9", "8", "7", "6", "1"]) ? "9" + _num : _num;
      break;
    default:
      _ddi = "";
      _ddd = "";
      _num = valor;
      break;
  }

  _ddi = manterDDI ? _ddi : "";
  _ddd = manterDDD || _ddd !== informacoesLocais.DDD ? _ddd : "";

  novoValor = _ddi + _ddd + _num;
  return novoValor;
}

export function formatCEP(txt: string) {
  const valor = txt.replace(/[^0-9]/g, "");
  if (valor.length === 8) {
    return `${valor.slice(0, 5)}-${valor.slice(5, 8)}`;
  } else {
    return valor;
  }
}

export const sanitizeData = (data: any): any => {
  if (data === undefined) return null;
  if (Array.isArray(data)) return data.map(sanitizeData);
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeData(value)])
    );
  }
  return data;
};

export function normalizarOrdinal(logradouro: string): string {
  const ordinaisBasicos: Record<string, number> = {
    primeira: 1,
    segundo: 2,
    segunda: 2,
    terceira: 3,
    terceiro: 3,
    quarta: 4,
    quarto: 4,
    quinta: 5,
    quinto: 5,
    sexta: 6,
    sexto: 6,
    sétima: 7,
    sétimo: 7,
    oitava: 8,
    oitavo: 8,
    nona: 9,
    nono: 9,
    décima: 10,
    décimo: 10,
    vigésima: 20,
    vigésimo: 20,
    trigésima: 30,
    trigésimo: 30,
    quadragésima: 40,
    quadragésimo: 40,
    quinquagésima: 50,
    quinquagésimo: 50,
    sexagésima: 60,
    sexagésimo: 60,
    septuagésima: 70,
    septuagésimo: 70,
    octogésima: 80,
    octogésimo: 80,
    nonagésima: 90,
    nonagésimo: 90,
    centésima: 100,
    centésimo: 100,
  };

  function abreviar(numero: number, genero: "f" | "m") {
    return numero + (genero === "f" ? "ª" : "º");
  }

  let result = logradouro;

  // Regex captura algo como "décima segunda", "vigésima primeira", etc.
  const regex = new RegExp(
    "\\b(" +
      Object.keys(ordinaisBasicos).join("|") +
      ")(\\s+(primeira|primeiro|segunda|segundo|terceira|terceiro|quarta|quarto|quinta|quinto|sexta|sexto|sétima|sétimo|oitava|oitavo|nona|nono))?\\b",
    "i"
  );

  const match = result.match(regex);

  if (match) {
    const base = match[1].toLowerCase();
    const complemento = match[3]?.toLowerCase();

    let numero = ordinaisBasicos[base] || 0;
    if (complemento) numero += ordinaisBasicos[complemento] || 0;

    // gênero: assume feminino se achar "travessa", "rua", etc.
    const genero = /\b(travessa|rua|avenida|ladeira)\b/i.test(result)
      ? "f"
      : "m";

    const abreviado = abreviar(numero, genero);
    result = result.replace(regex, abreviado);
  }

  return result;
}
