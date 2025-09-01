import { useState } from "react";

import { useRouter } from "next/router";
import { MyInput } from "@components/pedido/myInput";
import { toast } from "react-toastify";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import { CupomStyle } from "./styles";
import { env } from "@config/env";
import axios from "axios";
import { axiosOk } from "@util/axios";
import { usePedidoStore } from "src/infra/zustand/pedido";

export const CupomView = () => {
  const { pedido } = usePedidoStore();
  const router = useRouter();
  const [cupom, setCupom] = useState("");
  return (
    <CupomStyle>
      <TextContainer
        title="Insira seu cupom"
        description="Se você tiver algum cupom de desconto, insira abaixo"
      />
      <form className="menu">
        <MyInput
          name=""
          description=""
          maxLength={12}
          type="text"
          value={cupom}
          autoFocus
          setValue={(value) => setCupom(value as string)}
        />
      </form>

      <BottomControls
        backButton
        primaryButton={{
          disabled: !cupom.replace(/\s/g, ""),
          click: async () => {
            try {
              const res = await axios.get(
                `${env.apiURL}/cupons?codigo=${cupom}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (axiosOk(res.status)) {
                const cupomValido = !!res.data.length;
                if (!cupomValido) throw new Error("Cupom inválido");
                await axios.patch(
                  `${env.apiURL}/pedidos`,
                  {
                    pedidoId: pedido.id,
                    pedido: {
                      codigoCupom: cupom,
                    },
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                router.replace("/pedido");
              } else {
                throw new Error("Cupom inválido");
              }
            } catch (err) {
              toast.error(
                err.message ?? "Oops, não foi possível obter esse cupom"
              );
            }
          },
        }}
      />
    </CupomStyle>
  );
};
