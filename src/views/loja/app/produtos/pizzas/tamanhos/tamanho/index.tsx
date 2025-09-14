import TextContainer from "@components/textContainer";
import { TamanhoViewStyle } from "./styles";
import { ReactNode, useEffect, useState } from "react";
import { IPizzaTamanho } from "tpdb-lib";
import Image from "next/image";
import { useRouter } from "next/router";
import { MyInput } from "@components/pedido/myInput";
import { isImageUrl, isValidUrl } from "@util/conversion";
import { toast } from "react-toastify";
import { Regras } from "src/views/loja/components/regras";
import { useTamanhos } from "../context";
import { MyInputStyle } from "@components/pedido/myInput/styles";
import { ButtonPrimary, ButtonSecondary } from "@styles/components/buttons";
import { FaClipboard, FaTrash } from "react-icons/fa";
import z from "zod";
import Loading from "@components/loading";
import { SetState } from "@config/react";
import { NumberInput } from "src/views/loja/components/numberInput";
import { ImageEditor } from "src/views/loja/components/imageEditor";
import { EditorBottom } from "src/views/loja/components/editorBottom";
import { EditorForm } from "src/views/loja/components/editorForm";
import { colors } from "@styles/colors";

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

      // const res = await api.post(`/clientes/cadastro`, {
      //   cliente,
      // });

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
            <MyInput
              name="Nome"
              type="text"
              value={tamanho.nome ?? ""}
              setValue={(val) =>
                setTamanho((prev) => ({ ...prev, nome: String(val) }))
              }
            />

            <NumberInput
              id={"estoque"}
              disabled={tamanho.estoque == null}
              value={tamanho.estoque ?? ("" as unknown as number)}
              setValue={(val) => {
                setTamanho((prev) => ({
                  ...prev,
                  estoque: val,
                }));
              }}
              label={
                <label
                  htmlFor="estoque"
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <span>Estoque</span>
                  <input
                    type="checkbox"
                    checked={tamanho.estoque != null}
                    onChange={(e) => {
                      setTamanho((prev) => ({
                        ...prev,
                        estoque: e.target.checked ? 1 : undefined,
                      }));
                      setTimeout(() => {
                        console.log("vai mudar");
                        const el = document.querySelector(
                          "#estoque"
                        ) as HTMLInputElement;
                        el?.focus();
                        el?.select();
                      }, 0);
                    }}
                  />
                </label>
              }
            />
          </div>
        </div>

        <MyInput
          name="Descrição"
          type="text"
          maxLength={80}
          value={tamanho.descricao ?? ""}
          setValue={(val) =>
            setTamanho((prev) => ({ ...prev, descricao: String(val) }))
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

        <div className="checkers">
          <MyInput
            name="Disponível"
            type="checkbox"
            checked={tamanho.disponivel == null ? true : tamanho.disponivel}
            setChecked={(checked) =>
              setTamanho((prev) => ({ ...prev, disponivel: checked }))
            }
          />
          <MyInput
            name="Visível"
            type="checkbox"
            checked={tamanho.visivel == null ? true : tamanho.visivel}
            setChecked={(checked) =>
              setTamanho((prev) => ({ ...prev, visivel: checked }))
            }
          />
          <MyInput
            name="Só combos"
            type="checkbox"
            checked={!!tamanho.somenteEmCombos}
            setChecked={(checked) =>
              setTamanho((prev) => ({ ...prev, somenteEmCombos: checked }))
            }
          />
        </div>
        <Regras condicoes={tamanho.condicoes} excecoes={tamanho.excecoes} />
      </EditorForm>
    </TamanhoViewStyle>
  );
};
