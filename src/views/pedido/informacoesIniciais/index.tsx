import { useState } from "react";
import { useRouter } from "next/router";
import { MyInput } from "@components/pedido/myInput";
import { toast } from "react-toastify";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import z from "zod";
import { InformacoesIniciaisStyle } from "./styles";
import { api, axiosOk } from "@util/axios";
import { useClienteStore } from "src/infra/zustand/cliente";
import { isValidPhoneNumber } from "react-phone-number-input";
import { normalizePhone } from "@util/enderecos/format";
import parsePhoneNumberFromString from "libphonenumber-js";

type FormData = {
  nome: string;
  sobrenome: string;
  whatsapp: string;
  confirmacaoWhatsapp: string;
  cpf: string;
  dataNasc: string;
};

export const InformacoesIniciaisView = () => {
  const router = useRouter();
  const { setCliente } = useClienteStore();

  const [achouCliente, setAchouCliente] = useState<
    "naoProcurou" | "achou" | "naoAchou"
  >("naoProcurou");

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    sobrenome: "",
    whatsapp: "",
    confirmacaoWhatsapp: "",
    cpf: "",
    dataNasc: undefined,
  });

  // Validador de nome: pelo menos 2 palavras
  const nomeSchema = z.string().min(3, { message: "Nome inválido" });

  const sobrenomeSchema = z.string().min(3, { message: "Sobrenome inválido" });

  // Regex simplificado para DDI (ex: +55, +1, etc.)
  const ddiRegex = /^\+\d{1,4}$/;

  function isValidPhone(phone: string): boolean {
    const parsed = parsePhoneNumberFromString(phone);

    if (!parsed) return false;

    // Checa se o número é válido de acordo com as regras do país
    return parsed.isValid();
  }

  // +55718872692
  // +5571988888888

  // Validador de telefone (com DDI, DDD e número)
  const telefoneSchema = z
    .string()
    .refine(
      (val) => {
        const a = isValidPhone(val);

        return a;
      },
      {
        message: "Número de telefone inválido ou muito curto",
      }
    )
    .refine(
      (val) => {
        const regex = /^\+55\d{2}\d{9}$/;

        return !val.startsWith("+55") || regex.test(val);
      },
      {
        message:
          "Número de telefone inválido! Esqueceu de inserir o 9 na frente?",
      }
    )
    .refine(
      (val) => {
        const ehValido = isValidPhoneNumber(val);
        return ehValido;
      },
      {
        message: "Número de telefone inválido",
      }
    );

  const confirmacaoTelefoneSchema = z
    .string()
    .refine((val) => val === formData.whatsapp, "O telefone não coincide");

  const clienteSchema = z.object({
    nome: nomeSchema,
    sobrenome: sobrenomeSchema,
    whatsapp: telefoneSchema,
    confirmacaoWhatsapp: confirmacaoTelefoneSchema,

    // cpf: z
    //   .string()
    //   .optional()
    //   .refine((cpf) => cpf === undefined || /^\d{11}$/.test(cpf), {
    //     message: "CPF deve conter exatamente 11 dígitos",
    //   }),
    // dataNascimento: z
    //   .string()
    //   .optional()
    //   .refine((d) => !d || !isNaN(Date.parse(d)), {
    //     message: "Data de nascimento inválida",
    //   }),
    contatosExtras: z.array(telefoneSchema).optional(),
  });

  const logar = async () => {
    try {
      const { whatsapp } = formData;
      const resultado = telefoneSchema.safeParse(whatsapp);

      if (!resultado.success) {
        toast.error(`${resultado.error.issues[0].message}`);
        return;
      }

      const res = await api.post(`/clientes/login`, {
        whatsapp,
      });

      if (axiosOk(res.status)) {
        if (res.data) {
          setCliente(res.data);
          localStorage.setItem("clienteId", res.data.id);
          router.replace("/pedido");
        } else {
          setAchouCliente("naoAchou");
        }
      }
    } catch (err) {
      toast.error("Oops, não foi possível fazer seu cadastro no momento!");
    }
  };
  const cadastrar = async () => {
    try {
      const resultado = clienteSchema.safeParse(formData);

      if (!resultado.success) {
        toast.error(`${resultado.error.issues[0].message}`);
        return;
      }

      const { nome, sobrenome, whatsapp } = formData;
      const cliente = {
        nome: (nome + " " + sobrenome).trim(),
        whatsapp,
      };

      const res = await api.post(`/clientes/cadastro`, {
        cliente,
      });

      if (axiosOk(res.status)) {
        if (res.data) {
          setCliente(res.data);
          localStorage.setItem("clienteId", res.data.id);
          router.replace("/pedido");
        }
      }
    } catch (err) {
      toast.error("Oops, não foi possível fazer seu cadastro no momento!");
    }
  };

  const handleSubmit = async () => {
    if (achouCliente === "naoProcurou") {
      logar();
    } else if (achouCliente === "naoAchou") {
      cadastrar();
    }
  };

  return (
    <InformacoesIniciaisStyle>
      <form
        className="menu"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {achouCliente !== "naoAchou" ? (
          <TextContainer
            title="Bem vindo!"
            subtitle="Pra fazer um pedido, informe seu whatsapp"
          />
        ) : (
          <TextContainer
            title="Cadastre-se"
            subtitle="Informe seus dados e confirme o whatsapp"
          />
        )}
        {achouCliente === "naoAchou" && (
          <div className="nome-sobrenome">
            <MyInput
              name="Nome *"
              minLength={3}
              maxLength={15}
              type="name"
              value={formData.nome}
              setValue={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  nome: value as string,
                }))
              }
              onPaste={(e) => {
                const input = e.target as HTMLInputElement;
                const texto = e.clipboardData.getData("text");
                const textoLimpo = texto.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

                if (texto !== textoLimpo) {
                  e.preventDefault();
                  input.setRangeText(
                    textoLimpo,
                    input.selectionStart ?? 0,
                    input.selectionEnd ?? 0,
                    "end"
                  );
                }
              }}
              onDrop={(e) => {
                const input = e.target as HTMLInputElement;

                const texto = e.dataTransfer.getData("text");
                const regex = /^[A-Za-zÀ-ÿ\s]+$/;

                if (!regex.test(texto)) {
                  e.preventDefault();
                  const textoLimpo = texto.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                  input.setRangeText(
                    textoLimpo,
                    input.selectionStart ?? 0,
                    input.selectionEnd ?? 0,
                    "end"
                  );
                }
              }}
              onBeforeInput={(e) => {
                const regex = /^[A-Za-zÀ-ÿ\s]+$/;

                if (e.data && !regex.test(e.data)) {
                  e.preventDefault(); // impede a inserção do caractere inválido
                }
              }}
              onBlur={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  nome: e.target.value.trim(),
                }));
              }}
            />

            <MyInput
              name="Sobrenome *"
              minLength={3}
              maxLength={15}
              type="name"
              value={formData.sobrenome}
              setValue={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  sobrenome: value as string,
                }))
              }
              onPaste={(e) => {
                const input = e.target as HTMLInputElement;
                const texto = e.clipboardData.getData("text");
                const textoLimpo = texto.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

                if (texto !== textoLimpo) {
                  e.preventDefault();
                  input.setRangeText(
                    textoLimpo,
                    input.selectionStart ?? 0,
                    input.selectionEnd ?? 0,
                    "end"
                  );
                }
              }}
              onDrop={(e) => {
                const input = e.target as HTMLInputElement;

                const texto = e.dataTransfer.getData("text");
                const regex = /^[A-Za-zÀ-ÿ\s]+$/;

                if (!regex.test(texto)) {
                  e.preventDefault();
                  const textoLimpo = texto.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                  input.setRangeText(
                    textoLimpo,
                    input.selectionStart ?? 0,
                    input.selectionEnd ?? 0,
                    "end"
                  );
                }
              }}
              onBeforeInput={(e) => {
                const regex = /^[A-Za-zÀ-ÿ\s]+$/;

                if (e.data && !regex.test(e.data)) {
                  e.preventDefault(); // impede a inserção do caractere inválido
                }
              }}
              onBlur={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  sobrenome: e.target.value.trim(),
                }));
              }}
            />
          </div>
        )}

        <MyInput
          name="Telefone *"
          description="De preferência Whatsapp"
          type="phoneNumber"
          value={formData.whatsapp}
          minLength={8}
          setValue={(value) =>
            setFormData((prev) => ({
              ...prev,
              whatsapp: value as string,
            }))
          }
          onBlur={() => {
            if (isValidPhoneNumber(formData.whatsapp)) {
              setFormData((prev) => ({
                ...prev,
                whatsapp: normalizePhone(prev.whatsapp),
              }));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && achouCliente === "naoProcurou") {
              handleSubmit();
            }
          }}
        />
        {achouCliente === "naoAchou" && (
          <>
            <MyInput
              name="Confirme seu telefone *"
              type="phoneNumber"
              value={formData.confirmacaoWhatsapp}
              minLength={8}
              setValue={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmacaoWhatsapp: value as string,
                }))
              }
              onBlur={() => {
                if (isValidPhoneNumber(formData.confirmacaoWhatsapp)) {
                  setFormData((prev) => ({
                    ...prev,
                    confirmacaoWhatsapp: normalizePhone(
                      prev.confirmacaoWhatsapp
                    ),
                  }));
                }
              }}
              onKeyDown={(e) => {
                if (e.ctrlKey) e.preventDefault();
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </>
        )}

        {/* <button>Mostrar campos opcionais</button> */}

        {/* <MyInput
                    name="Data de nasc."
                    type="date"
                    description="Servirá para futuramente aplicarmos promoções para aniversariantes entre outros"
                    value={cliente.dataNasc ?? new Date()}
                    minLength={8}
                    maxLength={10}
                    setValue={(value) =>
                      setCliente((prev) => ({
                        ...prev,
                         whatsapp: value as string,
                      }))
                    }
                  /> */}
      </form>

      <BottomControls
        secondaryButton={{
          click: () => {
            achouCliente === "naoProcurou"
              ? router.replace("/")
              : setAchouCliente("naoProcurou");
          },
        }}
        primaryButton={{
          click: handleSubmit,
        }}
      />
    </InformacoesIniciaisStyle>
  );
};
