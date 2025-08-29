import { ICupom, IEndereco } from "tpdb-lib";

export const cupomAplicavel = (cupom: ICupom | null, endereco: IEndereco) => {
  if (!cupom) return false;
  for (let cond of cupom?.condicoes ?? []) {
    if (
      cond.tipo === "bairros" &&
      !cond.valor.some((x) => x.toLowerCase() === endereco.bairro.toLowerCase())
    )
      return false;
    if (
      cond.tipo === "ceps" &&
      !cond.valor.some(
        (x) => x.replace(/\D+/g, "") === endereco.cep.replace(/\D+/g, "")
      )
    )
      return false;
    if (
      cond.tipo === "max_distancia" &&
      cond.valor > (endereco.distancia_metros ?? 0)
    )
      return false;
    if (
      cond.tipo === "min_distancia" &&
      cond.valor < (endereco.distancia_metros ?? 1000000000)
    )
      return false;
  }
  for (let exc of cupom.excecoes ?? []) {
    if (
      exc.tipo === "bairros" &&
      exc.valor.some((x) => x.toLowerCase() === endereco.bairro.toLowerCase())
    )
      return false;
    if (
      exc.tipo === "ceps" &&
      exc.valor.some(
        (x) => x.replace(/\D+/g, "") === endereco.cep.replace(/\D+/g, "")
      )
    )
      return false;
    if (
      exc.tipo === "max_distancia" &&
      exc.valor < (endereco.distancia_metros ?? 0)
    )
      return false;
    if (
      exc.tipo === "min_distancia" &&
      exc.valor > (endereco.distancia_metros ?? 1000000000)
    )
      return false;
  }

  return true;
};
