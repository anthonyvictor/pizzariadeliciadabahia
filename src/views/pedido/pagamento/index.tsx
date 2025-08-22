import TextContainer from "@components/textContainer";
import { PagamentoViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { IPagamentoTipo, IPedido } from "tpdb-lib";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatCurrency } from "@util/format";
import { MdCreditCard, MdPix, MdAttachMoney } from "react-icons/md";
import { colors } from "@styles/colors";
import { ICupom } from "tpdb-lib";
import { obterValoresDoPedido } from "@util/pedidos";
import { IMetodo } from "./types";
import { Metodo } from "./metodo";
import { usePagamentoStore } from "src/infra/zustand/pagamentos";
import axios from "axios";
import { env } from "@config/env";
import { toast } from "react-toastify";

export const PagamentoView = ({
  pedido,
  cupomPagamento,
}: {
  pedido: IPedido;
  cupomPagamento: ICupom;
}) => {
  const { pagamentos } = usePagamentoStore();
  const { valorTotalComDescontos, valorItensComDesconto } =
    obterValoresDoPedido(pedido);
  const valorDefinido = pagamentos
    ? pagamentos.reduce((acc, curr) => acc + curr.valor, 0)
    : 0;

  const router = useRouter();

  useEffect(() => {
    console.log("pagamentos", pagamentos);
  }, [pagamentos]);
  const metodos: Record<IPagamentoTipo, IMetodo> = {
    pix: {
      icone: MdPix,
      tipo: "pix",
      titulo: "PIX Online",
      legenda: "via PIX",
      emoji: "💠",
      cor: colors.pix,
      cupom: cupomPagamento,
    },
    especie: {
      icone: MdAttachMoney,
      tipo: "especie",
      titulo: "Dinheiro",
      legenda: "em espécie",
      emoji: "💵",
      cor: colors.checkedDark,
      cupom: cupomPagamento,
    },
    cartao: {
      icone: MdCreditCard,
      tipo: "cartao",
      titulo: "Cartão",
      legenda: "no cartão",
      emoji: "💳",
      cor: colors.card,
      cupom: cupomPagamento,
    },
  };

  return (
    <PagamentoViewStyle>
      <TextContainer
        title="Pagamento"
        subtitle={`VALOR TOTAL ${formatCurrency(valorTotalComDescontos)}`}
        description={
          pedido?.tipo === "entrega"
            ? pedido.endereco.desconto
              ? `(Desconto na entrega aplicado!)`
              : (pedido?.endereco?.taxa ?? 0) > 0
              ? ` (ITENS + ENTREGA)`
              : undefined
            : undefined
        }
        descriptionColor={
          pedido?.tipo === "entrega" && pedido.endereco.desconto
            ? colors.elements
            : undefined
        }
      />
      <div className="menu">
        <ul className="metodos no-scroll">
          {(["especie", "pix", "cartao"] as IPagamentoTipo[]).map((x) => (
            <Metodo
              valorDefinido={valorDefinido}
              valorTotal={valorTotalComDescontos}
              valorItens={valorItensComDesconto}
              key={x}
              metodo={metodos[x as IPagamentoTipo]}
              pedido={pedido}
              cupomPagamento={cupomPagamento}
            />
          ))}
        </ul>
      </div>

      <BottomControls
        backButton
        primaryButton={{
          text: "Continuar",
          disabled: valorDefinido !== valorTotalComDescontos,
          click: async () => {
            if (valorDefinido === valorTotalComDescontos) {
              axios
                .post(`${env.apiURL}/pedidos/pagamento`, {
                  pedidoId: pedido.id,
                  pagamentos,
                })
                .then(() => {
                  const pix = pagamentos.find((x) => x.tipo === "pix");
                  if (pix) {
                    router.push(`/pedido/pagamento/pix`);
                  } else {
                    axios
                      .post(`${env.apiURL}/pedidos/finalizar`, {
                        pedidoId: pedido.id,
                      })
                      .then(() => {
                        router.push(`/pedido/finalizado`);
                      });
                  }
                })
                .catch((err) => {
                  console.error(err);
                  toast.error(
                    "Oops, houve um erro interno, informe à pizzaria"
                  );
                });
            } else {
              toast.error("Informe o pagamento do pedido corretamente!");
            }
          },
        }}
      />
    </PagamentoViewStyle>
  );
};
