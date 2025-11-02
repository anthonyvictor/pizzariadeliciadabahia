import TextContainer from "@components/textContainer";
import { ConfigViewStyle } from "./styles";
import { IConfig } from "tpdb-lib";
import { useRouter } from "next/router";
import { useConfigs } from "../context";
import z from "zod";
import Loading from "@components/loading";
import { usePopState } from "@util/hooks/popState";
import { Horario } from "../chaves/horario";

export const ConfigView = () => {
  const { editando, configs, carregando, setEditando } = useConfigs();
  const config = {
    ...(configs.find((x) => x.chave === editando) ?? {}),
  } as IConfig;
  const router = useRouter();

  usePopState(router, () => {
    setEditando(undefined);
  });

  const schema = z.object({
    nome: z.string().min(4, "Nome deve ter no mínimo 4 caracteres"),
    descricao: z.string().optional(),
    estoque: z
      .any()
      .refine(
        (val) => val == null || !isNaN(Number(val)),
        "Estoque precisa ser um número se existir"
      ),
    valor: z.number(),
  });

  if (carregando) return <Loading />;
  return (
    <ConfigViewStyle>
      <TextContainer title={config.nome} description={config.descricao} />

      {/* {!!chave && <h6 onClick={() => {}}>{chave}</h6>} */}

      {config.chave === "horario_funcionamento" ? (
        <Horario config={config.valor} />
      ) : config.chave === "entrega" ? (
        <></>
      ) : config.chave === "entrega_avancada" ? (
        <></>
      ) : config.chave === "estimativa" ? (
        <></>
      ) : config.chave === "pagamento" ? (
        <></>
      ) : (
        <></>
      )}
    </ConfigViewStyle>
  );
};
