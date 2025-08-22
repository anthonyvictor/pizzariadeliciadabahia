import { IDistancia } from "tpdb-lib";

// Função para encontrar a taxa com base na distância
export function encontrarTaxa(
  distanciaMetros: number,
  faixasDistancia: IDistancia[]
): number | undefined {
  // Encontra a faixa onde a distância se encaixa
  const faixaEncontrada = faixasDistancia.find(
    (faixa) => distanciaMetros >= faixa.de && distanciaMetros <= faixa.ate
  );

  return faixaEncontrada?.taxa ?? 0;
}
