import { useState } from "react";

import { useRouter } from "next/router";
import { MyInput } from "@components/pedido/myInput";

import { toast } from "react-toastify";

import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";

import { ICliente } from "tpdb-lib";
import z from "zod";
import { InformacoesIniciaisStyle } from "./styles";
import { env } from "@config/env";
import axios from "axios";
import { axiosOk } from "@util/axios";
import { useClienteStore } from "src/infra/zustand/cliente";
import { isValidPhoneNumber } from "react-phone-number-input";
import { normalizePhone } from "@util/enderecos/format";
import parsePhoneNumberFromString from "libphonenumber-js";

export const InformacoesIniciaisView = () => {
  const router = useRouter();
  const { login } = useClienteStore();
  const [cliente, setCliente] = useState<ICliente>({
    id: "",
    nome: "",
    whatsapp: "",
    cpf: "",
    dataNasc: undefined,
    contatosExtras: [],
  } as ICliente);

  // Validador de nome: pelo menos 2 palavras
  const nomeSchema = z
    .string()
    .min(3, { message: "Nome inválido" })
    .refine(
      (nome) => {
        const partes = nome.trim().split(" ");
        return partes.length >= 2;
      },
      {
        message: "Insira nome e sobrenome",
      }
    );

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
        console.log("eh valido no click", ehValido, val);
        return ehValido;
      },
      {
        message: "Número de telefone inválido",
      }
    );

  const clienteSchema = z.object({
    nome: nomeSchema,
    whatsapp: telefoneSchema,
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

  const handleSubmit = async () => {
    try {
      const resultado = clienteSchema.safeParse(cliente);

      if (!resultado.success) {
        toast.error(`${resultado.error.issues[0].message}`);
        return;
      }

      const res = await axios.post(
        `${env.apiURL}/clientes`,
        {
          cliente: {
            ...cliente,
            dadosExtras: [
              {
                chave: "randomCentavos",
                valor: Number((Math.random() * 0.06).toFixed(2)),
              },
            ],
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (axiosOk(res.status)) {
        login(res.data);
        localStorage.setItem("clienteId", res.data.id);
        router.push("/pedido");
      }
    } catch (err) {
      toast.error("Oops, não foi possível fazer seu cadastro no momento!");
    }
  };

  return (
    <InformacoesIniciaisStyle>
      <TextContainer
        title="Informe seus dados"
        subtitle="Pra fazer um pedido, informe seus dados"
        description="Os campos com asterísco (*) são obrigatórios"
      />
      <form className="menu">
        <MyInput
          name="Nome *"
          description="E sobrenome"
          maxLength={30}
          type="name"
          value={cliente.nome}
          setValue={(value) =>
            setCliente((prev) => ({
              ...prev,
              nome: value as string,
            }))
          }
        />

        <MyInput
          name="Telefone *"
          description="De preferência Whatsapp"
          type="phoneNumber"
          value={cliente.whatsapp}
          minLength={8}
          setValue={(value) =>
            setCliente((prev) => ({
              ...prev,
              whatsapp: value as string,
            }))
          }
          onBlur={() => {
            if (isValidPhoneNumber(cliente.whatsapp)) {
              setCliente((prev) => ({
                ...prev,
                whatsapp: normalizePhone(prev.whatsapp),
              }));
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />

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
        backButton
        primaryButton={{
          click: handleSubmit,
        }}
      />
    </InformacoesIniciaisStyle>
  );
};
