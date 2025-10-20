import { IConfig, IConfigEntrega, IConfigEntregaAvancada } from "tpdb-lib";

export const getAdicionaisTaxa = (configs: IConfig[]) => {
  const cfgEntregaAvancada = configs.find((x) => x.chave === "entrega_avancada")
    ?.valor as IConfigEntregaAvancada;
  const cfgEntrega = configs.find((x) => x.chave === "entrega")
    ?.valor as IConfigEntrega;

  const taxaAdicional = cfgEntregaAvancada?.taxaAdicional ?? "";

  const adicionalDinamico =
    cfgEntrega?.adicionalDinamico?.ate && cfgEntrega?.adicionalDinamico?.valor
      ? new Date(cfgEntrega.adicionalDinamico?.ate).getTime() >
        new Date().getTime()
        ? cfgEntrega?.adicionalDinamico?.valor ?? ""
        : ""
      : "";

  return { taxaAdicional, adicionalDinamico };
};
