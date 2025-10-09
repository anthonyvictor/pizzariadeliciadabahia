import TextContainer from "@components/textContainer";
import { ComboViewStyle } from "./styles";
import { useEffect, useState } from "react";
import { IBebida, ICombo, ILanche, IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Regras } from "src/views/loja/components/regras";
import { useCombos } from "../context";
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
import Image from "next/image";
import { abreviarBebida } from "@util/bebidas";
import { capitalize, formatCurrency } from "@util/format";
export interface IComboProds {
  tamanhos: IPizzaTamanho[];
  sabores: IPizzaSabor[];
  bebidas: IBebida[];
  lanches: ILanche[];
}
export const ComboView = () => {
  const { editando, combos, setCombos, setEditando } = useCombos();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState<ICombo>({
    ...{
      nome: "",
      imagemUrl: "",
      descricao: "",
      disponivel: true,
      visivel: true,
      estoque: undefined,
      condicoes: [],
      excecoes: [],
    },
    ...(combos.find((x) => x.id === editando) ?? {}),
  } as ICombo);
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

    const data = await salvar("/combos", "combos", [formData]);

    if (data) {
      setCombos((prev) => mergeArraysByKey(prev, data, "id"));
      setEditando(undefined);
    }

    setCarregando(false);
  };

  const [prods, setProds] = useState<IComboProds>({
    tamanhos: [],
    sabores: [],
    bebidas: [],
    lanches: [],
  });
  useEffect(() => {
    api
      .get("/produtos", {
        params: {
          deveEstar: 0,
        },
      })
      .then((res) => {
        if (res?.data) setProds(res.data);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  }, []);

  if (carregando) return <Loading />;
  return (
    <ComboViewStyle>
      <TextContainer title="Combo" />

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

        <Checkers
          disponivel={formData.disponivel}
          setDisp={(val) =>
            setFormData((prev) => ({ ...prev, disponivel: val }))
          }
          visivel={formData.visivel}
          setVis={(val) => setFormData((prev) => ({ ...prev, visivel: val }))}
        />
        {/* <NumberInput
          id="valor"
          label="Valor"
          value={formData.valormin}
          setValue={(valor) => setFormData((prev) => ({ ...prev, valor }))}
        /> */}

        <ul
          className="produtos "
          style={{ display: "flex", flexDirection: "column", gap: 5 }}
        >
          {formData.produtos.map((prod) => {
            return (
              <li
                key={prod.id}
                style={{
                  backgroundColor: "#00000040",
                  borderRadius: 5,
                  padding: 7,
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <aside>
                  <h3>Produto: {prod.tipo.toUpperCase()}</h3>
                </aside>
                <aside style={{ display: "flex", gap: 5 }}>
                  {prod.tipo === "pizza" ? (
                    <>
                      <aside
                        style={{
                          width: "40px",
                          height: "40px",
                          position: "relative",
                          background: "#fff",
                          borderRadius: 5,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={prod.tamanho.imagemUrl}
                          layout="fill"
                          objectFit="cover"
                        />
                      </aside>
                      <span>
                        <h4>{prod.tamanho.nome}</h4>
                        <h6>{prod.maxSabores ?? prod.tamanho.maxSabores}sab</h6>
                      </span>
                    </>
                  ) : prod.tipo === "bebida" ? (
                    <>
                      {prod.bebidas.length ? (
                        <ul
                          className="opcoes no-scroll"
                          style={{
                            display: "flex",
                            overflowX: "auto",
                            listStyle: "none",
                            gap: 5,
                          }}
                        >
                          {prod.bebidas.map((op) => (
                            <li
                              key={op.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                minWidth: "50px",
                                gap: 5,
                              }}
                            >
                              <aside
                                style={{
                                  width: "40px",
                                  height: "60px",
                                  position: "relative",
                                  background: "#fff",
                                  borderRadius: 5,
                                }}
                              >
                                <Image
                                  src={op.imagemUrl}
                                  layout="fill"
                                  objectFit="scale-down"
                                />
                              </aside>
                              <aside>
                                <h6 style={{ fontSize: ".6rem" }}>
                                  {capitalize(abreviarBebida(op.nome, true))
                                    .split(" ")
                                    .map((x, i) =>
                                      i === 0
                                        ? x.slice(0, 3)
                                        : i === 1 &&
                                          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].every(
                                            (y) => y.toString() !== x[0]
                                          )
                                        ? x[0]
                                        : x
                                    )
                                    .join(" ")}
                                </h6>
                                <small style={{ fontSize: ".7rem" }}>
                                  {formatCurrency(op.valor)}
                                </small>
                              </aside>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>Qualquer bebida</>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </aside>
                <aside>Valor min: {formatCurrency(prod.valorMin)}</aside>
              </li>
            );
          })}
        </ul>
        <Regras condicoes={formData.condicoes} excecoes={formData.excecoes} />
      </EditorForm>
    </ComboViewStyle>
  );
};
