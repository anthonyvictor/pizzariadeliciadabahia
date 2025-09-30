import TextContainer from "@components/textContainer";
import { SaborViewStyle } from "./styles";
import { useEffect, useState } from "react";
import { IPizzaSabor } from "tpdb-lib";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Regras } from "src/views/loja/components/regras";
import { useSabores } from "../context";
import z from "zod";
import Loading from "@components/loading";
import { NumberInput } from "src/views/loja/components/numberInput";
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
import { MyInput } from "@components/pedido/myInput";

export const SaborView = () => {
  const { editando, sabores, setSabores, setEditando } = useSabores();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState<IPizzaSabor>({
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
      valores: [],
      categoria: "",
    },
    ...(sabores.find((x) => x.id === editando) ?? {}),
  } as IPizzaSabor);
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      setEditando(undefined);
      return false; // impede a navegação normal
    };

    router.beforePopState(handlePopState);

    return () => {
      // importante: volta o comportamento ao padrão quando desmontar
      router.beforePopState(() => true);
    };
  }, [router]);

  const schema = z.object({
    nome: z.string().min(4, "Nome deve ter no mínimo 4 caracteres"),
    descricao: z.string().optional(),
    estoque: z
      .any()
      .refine(
        (val) => val == null || !isNaN(Number(val)),
        "Estoque precisa ser um número se existir"
      ),
    fatias: z.number(),
  });

  const handleSubmit = async () => {
    try {
      setCarregando(true);
      const resultado = schema.safeParse(formData);

      if (!resultado.success) {
        toast.error(`${resultado.error.issues[0].message}`);
        return;
      }

      const res = await api.post(`/pizzas/sabores`, {
        sabores: [formData],
      });

      if (!axiosOk(res.status) || !res.data)
        throw new NoLogError("Erro ao Salvar");
      setSabores((prev) => mergeArraysByKey(prev, res.data, "id"));
      setEditando(undefined);
    } catch (err) {
      toast.error("Oops, não foi possível salvar!");
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return <Loading />;
  return (
    <SaborViewStyle>
      <TextContainer title="Sabor" />

      <EditorForm
        handleClose={() => setEditando(undefined)}
        handleSubmit={handleSubmit}
      >
        <div className="img-nome-descricao-section">
          <ImageEditor
            imagemUrl={formData.imagemUrl}
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
        <MyInput
          name="Categoria"
          type="text"
          dataList={Array.from(new Set(sabores.map((x) => x.categoria)))}
          value={formData.categoria}
          setValue={(val) =>
            setFormData((prev) => ({ ...prev, categoria: String(val) }))
          }
        />
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
            id={"maxSabores"}
            label={"Sabores"}
            value={formData.maxSabores}
            setValue={(val) => {
              setFormData((prev) => ({
                ...prev,
                maxSabores: val,
              }));
            }}
          />
          <NumberInput
            id={"saborAprox"}
            label={"Sabor cm"}
            value={formData.saborAprox}
            setValue={(val) => {
              setFormData((prev) => ({
                ...prev,
                saborAprox: val,
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
        <Regras condicoes={formData.condicoes} excecoes={formData.excecoes} />
      </EditorForm>
    </SaborViewStyle>
  );
};
