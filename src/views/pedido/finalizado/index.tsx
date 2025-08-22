import TextContainer from "@components/textContainer";
import { ConfirmacaoViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { IPedido } from "tpdb-lib";
import { Item } from "../itens/item";
import { obterValoresDoPedido } from "@util/pedidos";
import { colors } from "@styles/colors";
import { formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import axios from "axios";
import { env } from "@config/env";
import { salvarCookie } from "@util/api";
import { axiosOk } from "@util/axios";
import { toast } from "react-toastify";
interface IInfo {
  titulo: string;
  valor: number;
  bold?: boolean;
  negativo?: boolean;
  cor?: string;
}
export const FinalizadoView = ({ pedido }: { pedido: IPedido }) => {
  const router = useRouter();

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
          click: () => {
            axios
              .post(`${env.apiURL}/pedidos`, {
                clienteId: pedido.cliente.id,
              })
              .then((res) => {
                if (axiosOk(res.status)) {
                  router.replace(`/pedido`);
                } else {
                  toast.error(
                    "Oops, não foi possível fazer um novo pedido agora!"
                  );
                }
              });
          },
        }}
      />
    </ConfirmacaoViewStyle>
  );
};
