import TextContainer from "@components/textContainer";
import { LancheViewStyle } from "./styles";
import { useState } from "react";
import { ILanche } from "tpdb-lib";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Regras } from "src/views/loja/components/regras";
import { useLanches } from "../context";
import z from "zod";
import Loading from "@components/loading";
import { ImageEditor } from "src/views/loja/components/imageEditor";
import { EditorForm } from "src/views/loja/components/editorForm";
import {
  Checkers,
  DescricaoInput,
  EstoqueInput,
  NomeInput,
} from "src/views/loja/components/inputs";
import { api, axiosOk } from "@util/axios";
import { mergeArraysByKey } from "@util/array";
import { NoLogError } from "@models/error";
import { usePopState } from "@util/hooks/popState";
import { NumberInput } from "src/views/loja/components/numberInput";
import { salvar, validar } from "../../../util/func";

export const LancheView = () => {
  const { editando, lanches, setLanches, setEditando } = useLanches();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState<ILanche>({
    ...{
      nome: "",
      imagemUrl: "",
      descricao: "",
      disponivel: true,
      visivel: true,
      somenteEmCombos: false,
      estoque: undefined,
      condicoes: [],
      excecoes: [],
      valor: 0,
    },
    ...(lanches.find((x) => x.id === editando) ?? {}),
  } as ILanche);
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

    if (!validar(schema, formData)) return;

    const data = await salvar("/lanches", "lanches", [formData]);

    if (data) {
      setLanches((prev) => mergeArraysByKey(prev, data, "id"));
      setEditando(undefined);
    }

    setCarregando(false);
  };

  if (carregando) return <Loading />;
  return (
    <LancheViewStyle>
      <TextContainer title="Lanche" />

      <EditorForm
        handleClose={() => setEditando(undefined)}
        handleSubmit={handleSubmit}
      >
        <div className="img-nome-descricao-section">
          <ImageEditor
            imagemUrl={formData.imagemUrl}
            objectFit="cover"
            setImagemUrl={(url) =>
              setFormData((prev) => ({ ...prev, imagemUrl: url }))
            }
          />

          <div className="nome-descricao-section">
            <NomeInput
              value={formData.nome ?? ""}
              setValue={(val) =>
                setFormData((prev) => ({ ...prev, nome: val }))
              }
            />

            <EstoqueInput
              value={formData.estoque}
              setValue={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  estoque: val,
                }))
              }
            />
          </div>
        </div>

        <DescricaoInput
          value={formData.descricao ?? ""}
          setValue={(val) =>
            setFormData((prev) => ({ ...prev, descricao: val }))
          }
        />
        {/* <MyInput
          name="Categoria"
          type="text"
          dataList={Array.from(new Set(lanches.map((x) => x.categoria)))}
          value={formData.categoria}
          setValue={(val) =>
            setFormData((prev) => ({ ...prev, categoria: String(val) }))
          }
        /> */}
        {/* <div className="info">
          <NumberInput
            id={"fatias"}
            label={"Fatias"}
            value={formData.fatias}
            setValue={(val) => {
              setFormData((prev) => ({
                ...prev,
                fatias: val,
              }));
            }}
          />
          <NumberInput
            id={"maxLanches"}
            label={"Lanches"}
            value={formData.maxLanches}
            setValue={(val) => {
              setFormData((prev) => ({
                ...prev,
                maxLanches: val,
              }));
            }}
          />
          <NumberInput
            id={"lancheAprox"}
            label={"Lanche cm"}
            value={formData.lancheAprox}
            setValue={(val) => {
              setFormData((prev) => ({
                ...prev,
                lancheAprox: val,
              }));
            }}
          />
        </div> */}

        <Checkers
          disponivel={formData.disponivel}
          setDisp={(val) =>
            setFormData((prev) => ({ ...prev, disponivel: val }))
          }
          visivel={formData.visivel}
          setVis={(val) => setFormData((prev) => ({ ...prev, visivel: val }))}
          somenteEmCombos={formData.somenteEmCombos}
          setSoCombos={(val) =>
            setFormData((prev) => ({ ...prev, somenteEmCombos: val }))
          }
        />
        <NumberInput
          id="valor"
          label="Valor"
          value={formData.valor}
          setValue={(valor) => setFormData((prev) => ({ ...prev, valor }))}
        />
        <Regras condicoes={formData.condicoes} excecoes={formData.excecoes} />
      </EditorForm>
    </LancheViewStyle>
  );
};
