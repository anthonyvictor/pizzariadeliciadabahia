import { encontrarTaxa } from "@util/distancias";
import { DistanciasModel, EnderecosModel, ff, IEndereco } from "tpdb-lib";

export const obterEnderecosExtras = async (enderecos: IEndereco[]) => {
  const distancias = (await ff({ m: DistanciasModel })).sort(
    (a, b) => a.de - b.de
  );
  const enderecosExtras = enderecos?.length
    ? await ff({
        m: EnderecosModel,
        q: {
          cep: { $in: enderecos.map((x) => x.cep) },
        },
      })
    : [];

  const enderecosCompletos = await Promise.all(
    enderecos.map(async (endereco: IEndereco) => {
      const enderecoExtra = enderecosExtras.find((x) => x.cep === endereco.cep);

      const taxaPorDistancia = encontrarTaxa(
        enderecoExtra.distancia_metros,
        distancias
      );

      return {
        ...enderecoExtra,
        ...endereco,
        taxa: enderecoExtra?.taxa ?? taxaPorDistancia,
      };
    })
  );

  return enderecosCompletos as IEndereco[];
};
