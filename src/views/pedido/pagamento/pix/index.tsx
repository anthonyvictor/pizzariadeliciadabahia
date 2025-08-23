import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import { IPagamentoPedidoPix, IPagamentoTipo, IPedido } from "tpdb-lib";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatCurrency } from "@util/format";
import { usePagamentoStore } from "src/infra/zustand/pagamentos";
import axios from "axios";
import { env } from "@config/env";
import { PixViewStyle } from "./styles";
import QRCode from "react-qr-code";
import { CgClipboard } from "react-icons/cg";
import { axiosOk } from "@util/axios";

export const PixView = ({
  pedido,
  pix,
}: {
  pedido: IPedido;
  pix: IPagamentoPedidoPix;
}) => {
  const { pagamentos } = usePagamentoStore();

  const router = useRouter();

  const [continuarDisabled, setContinuarDisabled] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setContinuarDisabled(false);
    }, 1000 * 30);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!continuarDisabled) {
        const res = await axios.get(
          `${env.apiURL}/pedidos/pagamento/pix?pedido=${pedido.id}&pix=${pix.id}`
        );

        if (!axiosOk(res.status)) return router.replace("/pedido/pagamento");
        if (res.data === true) {
          router.push("/pedido/pagamento/pixi");
        }
      }
    }, 1000 * 15);

    return () => {
      clearInterval(interval);
    };
  }, [continuarDisabled]);

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
              axios
                .post(`${env.apiURL}/pedidos/finalizar`, {
                  pedidoId: pedido.id,
                })
                .then(() => {
                  router.push(`/pedido/finalizado`);
                });
            },
          }}
        />
      )}
    </PixViewStyle>
  );
};
