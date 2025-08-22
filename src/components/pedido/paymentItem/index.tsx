import { FC } from "react";
import { IPagamentoPedido } from "tpdb-lib";
import { formatCurrency } from "@util/format";
import { PaymentItemStyle } from "./styles";

export const PaymentItem: FC<{ payment: IPagamentoPedido }> = ({ payment }) => {
  return (
    <PaymentItemStyle>
      <h5 className="title">{`${formatCurrency(payment.valor)} (${
        payment.tipo === "especie"
          ? "EM ESPÉCIE"
          : payment.tipo === "cartao"
          ? "NO CARTÃO"
          : "NO PIX"
      }${
        payment.tipo === "especie" && payment.trocoPara > 0
          ? " TROCO P/" + payment.trocoPara
          : ""
      }`}</h5>
      <button>x</button>
    </PaymentItemStyle>
  );
};
