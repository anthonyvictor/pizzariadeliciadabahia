import { normalizarOrdinal } from "@util/format";
import { IEndereco, IRegraEndereco } from "tpdb-lib";

export const entreEnderecos = (
  { bairro, rua, cep }: IEndereco,
  regra: IRegraEndereco
) => {
  if (regra.tipo === "bairros") {
    const f = (v) => v?.toLowerCase?.();
    return regra.valor.some((y) => f(y) === f(bairro));
  } else if (regra.tipo === "ceps") {
    const f = (v) => v?.replace?.(/\D+/g, "");
    return regra.valor.some((y) => f(y) === f(cep));
  } else if (regra.tipo === "ruas") {
    const f = (v) => normalizarOrdinal(v?.toLowerCase?.());
    return regra.valor.some((y) => f(y) === f(rua));
  }
  return true;
};
