import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import { IPagamentoPedidoPix } from "tpdb-lib";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatCurrency } from "@util/format";
import axios from "axios";
import { env } from "@config/env";
import { PixViewStyle } from "./styles";
import QRCode from "react-qr-code";
import { CgClipboard } from "react-icons/cg";
import { axiosOk } from "@util/axios";
import { usePedidoStore } from "src/infra/zustand/pedido";
import { toast } from "react-toastify";

export const PixView = ({ pix }: { pix: IPagamentoPedidoPix }) => {
  const { pedido } = usePedidoStore();
  const router = useRouter();

  const [continuarDisabled, setContinuarDisabled] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setContinuarDisabled(false);
    }, 1000 * 40);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!pedido?.id || !pix?.id) return;
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    interval = setInterval(async () => {
      verificarPagamento();
    }, 1000 * 10);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [continuarDisabled, pedido.id, pix.id]);

  const verificarPagamento = async () => {
    try {
      const res = await axios.get(
        `${env.apiURL}/pedidos/pagamento/pix?pedido=${pedido.id}&pix=${pix.id}`
      );

      if (!axiosOk(res.status)) return router.replace("/pedido/pagamento");

      if (res.data === true) return router.push("/pedido/finalizado");
    } catch (err) {
      console.error("Erro na verificação do pagamento", err);
    }
  };

  return (
    <PixViewStyle>
      <TextContainer
        title="Pagamento via PIX"
        subtitle={`Escaneie o qrcode ou copie o código para pagar seu pedido`}
      />
      <div className="menu">
        <div className="qrcode-container">
          <h3 className="valor">
            Valor: {formatCurrency(pix.valor - (pix.desconto ?? 0))}
          </h3>
          <div className="qrcode">
            <QRCode size={200} value={pix.qrcode} />
          </div>
        </div>
        <div className="copiacola">
          <label className="label" htmlFor="copiacola">
            Pix Copia e Cola
          </label>
          <div className="input-container">
            <input
              id="copiacola"
              name="copiacola"
              defaultValue={pix.qrcode}
              onKeyDown={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={async () => {
                await navigator?.clipboard?.writeText?.(pix.qrcode);
              }}
            >
              <CgClipboard />
            </button>
          </div>
          <label className="description" htmlFor="copiacola">
            Copie o código e cole no app do seu banco na opção "Pix copia e
            cola"
          </label>
        </div>
      </div>
      {!continuarDisabled && (
        <BottomControls
          // backButton
          secondaryButton={{
            text: "Já paguei",
            click: async () => {
              await verificarPagamento();

              axios
                .post(`${env.apiURL}/pedidos/finalizar`, {
                  pedidoId: pedido.id,
                })
                .then(() => {
                  toast.info("Pedido finalizado!");
                  router.push(`/pedido/finalizado`);
                });
            },
          }}
        />
      )}
    </PixViewStyle>
  );
};
