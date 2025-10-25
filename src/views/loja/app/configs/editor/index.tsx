import TextContainer from "@components/textContainer";
import { ConfigViewStyle } from "./styles";
import { useState } from "react";
import { IConfig } from "tpdb-lib";
import { useRouter } from "next/router";
import { useConfigs } from "../context";
import z from "zod";
import Loading from "@components/loading";
import { EditorForm } from "src/views/loja/components/editorForm";
import { mergeArraysByKey } from "@util/array";
import { usePopState } from "@util/hooks/popState";
import { salvar, validar } from "../../util/func";
import { NumberInput } from "react-easy-ui";

export const ConfigView = () => {
  const { editando, configs, setConfigs, setEditando } = useConfigs();
  const [carregando, setCarregando] = useState(false);
  const [{ chave, descricao, nome, valor }, setFormData] = useState<IConfig>({
    ...(configs.find((x) => x.chave === editando) ?? {}),
  } as IConfig);
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

  const handleSubmit = async () => {
    setCarregando(true);

    // if (!validar(schema, formData)) return;

    const data = await salvar("/configs", "configs", [
      { chave, descricao, nome, valor },
    ]);

    if (data) {
      setConfigs((prev) => mergeArraysByKey(prev, data, "chave"));
      setEditando(undefined);
    }

    setCarregando(false);
  };

  const [a, setA] = useState(2.99);
  const [b, setB] = useState(2);
  const [c, setC] = useState(2);
  const [d, setD] = useState(2.99);
  const [e, setE] = useState(2.99);

  if (carregando) return <Loading />;
  return (
    <ConfigViewStyle>
      <label>[A] Real</label>
      <NumberInput
        value={a}
        setValue={(v) => setA(v)}
        min={0}
        decimalPlaces={2}
      />
      <label>[B] Estoque</label>
      <NumberInput value={b} setValue={(v) => setB(v)} buttons="vertical" />
      <label>[C] Quantidade FINAL</label>
      <NumberInput value={c} setValue={(v) => setC(v)} min={1} />
      <label>[D] Quantidade SABOR</label>
      <NumberInput
        value={d}
        setValue={(v) => setD(v)}
        min={0}
        beforeChange={(newVal) => newVal + 2 < 10}
      />
      <label>[E] fofo</label>
      <NumberInput value={e} setValue={(v) => setE(v)} />

      <TextContainer title={nome} description={descricao} />

      <EditorForm
        handleClose={() => setEditando(undefined)}
        handleSubmit={handleSubmit}
      >
        {!!chave && <h6 onClick={() => {}}>{chave}</h6>}

        {chave === "horario_funcionamento" ? (
          <>{valor.fechadoAte}</>
        ) : chave === "entrega" ? (
          <></>
        ) : chave === "entrega_avancada" ? (
          <></>
        ) : chave === "estimativa" ? (
          <></>
        ) : chave === "pagamento" ? (
          <></>
        ) : (
          <></>
        )}
      </EditorForm>
    </ConfigViewStyle>
  );
};
