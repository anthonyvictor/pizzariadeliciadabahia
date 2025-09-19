import TextContainer from "@components/textContainer";
import { TamanhoViewStyle } from "./styles";
import { useEffect, useState } from "react";
import { IPizzaTamanho } from "tpdb-lib";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Regras } from "src/views/loja/components/regras";
import { useTamanhos } from "../context";
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
import { api } from "@util/axios";

// type FormData = {
//     fatias: number;
//     tamanhoAprox: string;
//     maxSabores: string;
//     somenteEmCombos?: boolean;
//     condicoes?: IRegraProduto[];
//         excecoes?: IRegraProduto[];
//             nome: string;
//             descricao?: string;
//             disponivel: boolean;
//             imagemUrl?: string;
//             visivel: boolean;
//             estoque?: string;
//             criadoEm: Date;
// }

export const TamanhoView = () => {
  const { editando, tamanhos, setEditando } = useTamanhos();
  const [carregando, setCarregando] = useState(false);
  const [tamanho, setTamanho] = useState<IPizzaTamanho>({
    ...{
      nome: "",
      imagemUrl: "",
      descricao: "",
      disponivel: true,
      visivel: true,
      somenteEmCombos: false,
      estoque: undefined,
      fatias: "",
      maxSabores: "",
      tamanhoAprox: "",
      condicoes: [],
      excecoes: [],
    },
    ...(tamanhos.find((x) => x.id === editando) ?? {}),
  } as IPizzaTamanho);
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
      const resultado = schema.safeParse(tamanho);

      if (!resultado.success) {
        toast.error(`${resultado.error.issues[0].message}`);
        return;
      }

      // const { nome, sobrenome, whatsapp } = formData;
      // const cliente = {
      //   nome: (nome + " " + sobrenome).trim(),
      //   whatsapp,
      // };

      const res = await api.post(`/tamanhos`, {
        tamanho,
      });

      // if (axiosOk(res.status)) {
      //   if (res.data) {
      //     setCliente(res.data);
      //     localStorage.setItem("clienteId", res.data.id);
      //     router.replace("/pedido");
      //   }
      // }
    } catch (err) {
      toast.error("Oops, não foi possível salvar!");
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) return <Loading />;
  return (
    <TamanhoViewStyle>
      <TextContainer title="Tamanho" />

      <EditorForm
        handleClose={() => setEditando(undefined)}
        handleSubmit={handleSubmit}
      >
        <div className="img-nome-descricao-section">
          <ImageEditor
            imagemUrl={tamanho.imagemUrl}
            setImagemUrl={(url) =>
              setTamanho((prev) => ({ ...prev, imagemUrl: url }))
            }
          />

          <div className="nome-descricao-section">
            <NomeInput
              value={tamanho.nome ?? ""}
              setValue={(val) => setTamanho((prev) => ({ ...prev, nome: val }))}
            />

            <EstoqueInput
              value={tamanho.estoque || 0}
              setValue={(val) =>
                setTamanho((prev) => ({
                  ...prev,
                  estoque: val,
                }))
              }
            />
          </div>
        </div>

        <DescricaoInput
          value={tamanho.descricao ?? ""}
          setValue={(val) =>
            setTamanho((prev) => ({ ...prev, descricao: val }))
          }
        />

        <div className="info">
          <NumberInput
            id={"fatias"}
            label={"Fatias"}
            value={tamanho.fatias}
            setValue={(val) => {
              setTamanho((prev) => ({
                ...prev,
                fatias: val,
              }));
            }}
          />
          <NumberInput
            id={"maxSabores"}
            label={"Sabores"}
            value={tamanho.maxSabores}
            setValue={(val) => {
              setTamanho((prev) => ({
                ...prev,
                maxSabores: val,
              }));
            }}
          />
          <NumberInput
            id={"tamanhoAprox"}
            label={"Tamanho cm"}
            value={tamanho.tamanhoAprox}
            setValue={(val) => {
              setTamanho((prev) => ({
                ...prev,
                tamanhoAprox: val,
              }));
            }}
          />
        </div>

        <Checkers
          disponivel={tamanho.disponivel}
          setDisp={(val) =>
            setTamanho((prev) => ({ ...prev, disponivel: val }))
          }
          visivel={tamanho.visivel}
          setVis={(val) => setTamanho((prev) => ({ ...prev, visivel: val }))}
          somenteEmCombos={tamanho.somenteEmCombos}
          setSoCombos={(val) =>
            setTamanho((prev) => ({ ...prev, somenteEmCombos: val }))
          }
        />
        <Regras condicoes={tamanho.condicoes} excecoes={tamanho.excecoes} />
      </EditorForm>
    </TamanhoViewStyle>
  );
};
