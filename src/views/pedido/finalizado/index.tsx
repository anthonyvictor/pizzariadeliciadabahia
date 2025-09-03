import TextContainer from "@components/textContainer";
import { ConfirmacaoViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { useRouter } from "next/router";
import axios from "axios";
import { env } from "@config/env";
import { axiosOk } from "@util/axios";
import { toast } from "react-toastify";
import { usePedidoStore } from "src/infra/zustand/pedido";
import { useEffect } from "react";

export const FinalizadoView = () => {
  const router = useRouter();
  const { pedido } = usePedidoStore();

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/pedido");
      return false; // impede a navegação normal
    };

    router.beforePopState(handlePopState);

    return () => {
      // importante: volta o comportamento ao padrão quando desmontar
      router.beforePopState(() => true);
    };
  }, [router]);

  const novoPedido = () => {
    axios
      .post(`${env.apiURL}/pedidos`, {
        clienteId: pedido.cliente.id,
      })
      .then((res) => {
        if (axiosOk(res.status)) {
          router.replace(`/pedido`);
        } else {
          toast.error("Oops, não foi possível fazer um novo pedido agora!");
        }
      });
  };

  return (
    <ConfirmacaoViewStyle>
      <main className="menu">
        <TextContainer
          title="Pedido enviado!"
          description="Já já enviaremos uma mensagem para o whatsapp que você cadastrou!"
        />
      </main>

      <BottomControls
        secondaryButton={{
          text: "Fazer novo pedido",
          click: () => router.replace("/pedido"),
        }}
      />
    </ConfirmacaoViewStyle>
  );
};
