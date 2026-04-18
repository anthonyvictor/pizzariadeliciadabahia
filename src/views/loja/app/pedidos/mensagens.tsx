import {
  ModalCloseButton,
  ModalContainer,
  ModalOverlay,
} from "@styles/components/modal";
import { IPedido } from "tpdb-lib";
import { MensagemStyle } from "./styles";
import Text from "@components/text";
import { join } from "@util/misc";
import { formatCurrency, formatPhoneNumber } from "@util/format";
import { getCount } from "@util/array";
import { obterValoresDoPedido } from "@util/pedidos";

export const Mensagens = ({
  pedido,
  close,
}: {
  pedido: IPedido;
  close: () => void;
}) => {
  const getItensText = () => {
    return join(
      pedido.itens.map((item) => {
        switch (item.tipo) {
          case "pizza":
            return join(
              [
                `Pizza ${item.tamanho.nome}`,
                item.sabores.map((sab) => sab.nome).join(", "),
                join([
                  item.borda.padrao ? "" : item.borda.nome,
                  item.espessura.padrao ? "" : item.espessura.nome,
                  item.ponto.padrao ? "" : item.ponto.nome,
                  !item.extras.length
                    ? ""
                    : `Adic.: ${getCount(item.extras, (x) => x.id)
                        .map((x) =>
                          x.count > 1 ? `${x.count}x ${x.nome}` : x.nome,
                        )
                        .join(", ")}`,
                  item.observacoes,
                ]),
                `Preço: ${formatCurrency(item.valor - item.desconto)}`,
              ],
              "\n",
            );
          case "bebida":
            return join(
              [
                item.bebidaOriginal.nome,
                item.observacoes,
                `Preço: ${formatCurrency(item.valor - item.desconto)}`,
              ],
              "\n",
            );
          case "lanche":
            return join(
              [
                item.lancheOriginal.nome,
                item.observacoes,
                `Preço: ${formatCurrency(item.valor - item.desconto)}`,
              ],
              "\n",
            );
        }
      }),
      "\n\n",
    );
  };

  const getEnderecoText = (isAdmin?: boolean) => {
    const { bairro, rua, cep, cidade, estado } =
      pedido.endereco.enderecoOriginal;
    const { referencia, taxa, desconto, local, numero } = pedido.endereco;
    let maps = "";
    if (isAdmin) {
      const address = join([rua, numero, bairro, cidade, estado, cep]);

      maps = `*Maps:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    return join([
      rua,
      numero,
      bairro,
      local,
      referencia,
      isAdmin ? `*Cep:* ${cep}` : "",
      taxa - desconto > 0
        ? `*Taxa de entrega: ${formatCurrency(taxa - desconto)}*`
        : "*Taxa grátis*",
      maps,
    ]);
  };

  const getPagamentosText = () => {
    return join(
      pedido.pagamentos.map((pag) =>
        join(
          [
            formatCurrency(pag.valor),
            pag.tipo === "especie"
              ? join([
                  `em dinheiro `,
                  pag.trocoPara > pag.valor
                    ? `(troco p/${pag.trocoPara})`
                    : "(não precisa de troco)",
                ])
              : pag.tipo === "cartao"
                ? "no cartão"
                : "via PIX",
          ],
          "\n",
        ),
      ),
    );
  };
  const phoneForWhatsapp = () => {
    const phone = formatPhoneNumber(
      pedido.cliente.whatsapp,
      true,
      true,
    ).replace(/[\s-()]/gi, "");

    return phone;
  };
  const Li = ({
    text,
    msg,
    disabled,
  }: {
    text: string;
    msg: () => string;
    disabled?: boolean;
  }) => {
    return (
      <li
        className={`${disabled ? "disabled" : ""}`}
        onClick={() => {
          const _msg = msg();
          console.log(_msg);

          handleAction(_msg, phoneForWhatsapp());
          async function handleAction(text: string, phone: string) {
            const isMobile = /Android|iPhone|iPad|iPod/i.test(
              navigator.userAgent,
            );

            const encodedText = encodeURIComponent(text);
            const url = `https://wa.me/${phone}?text=${encodedText}`;

            if (isMobile) {
              // abre WhatsApp
              window.open(url, "_blank");
            } else {
              try {
                await navigator.clipboard.writeText(text);
                alert("Texto copiado!");
              } catch (err) {
                console.error(err);
                alert("Erro ao copiar texto");
              }
            }
          }
        }}
      >
        {text}
      </li>
    );
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalCloseButton onClick={close} />
        <MensagemStyle>
          <Text type="title">Mensagem</Text>

          <ul>
            <Li
              text="Confirmar pedido"
              msg={() => {
                const r = [];
                r.push("Confirmando pedido:");
                if (pedido.tipo === "entrega" && pedido.endereco) {
                  r.push(`*Endereço:* 🏍️`);
                  r.push(getEnderecoText());
                } else if (pedido.tipo === "retirada") {
                  r.push(`Pedido para retirada: 🏪`);
                }

                r.push(`*Itens:* 🍕`);
                r.push(getItensText());

                const { valorTotalComDescontos } = obterValoresDoPedido(pedido);

                r.push(`----------------`);
                r.push(`*Total: ${formatCurrency(valorTotalComDescontos)}* 💰`);
                r.push(`----------------`);

                if (pedido.pagamentos.length) {
                  r.push(`*Forma de pagamento:*`);
                  r.push(getPagamentosText());
                }

                r.push(`Podemos confirmar seu pedido?`);

                return r.join("\n\n");
              }}
            />

            <Li
              text="Pedido pronto / Saiu p. Ent."
              msg={() => {
                const r = [];
                if (pedido.tipo === "entrega") {
                  r.push(
                    "Opa! Seu pedido já saiu pra entrega, nosso entregador está a caminho! 🏍️",
                  );
                } else {
                  r.push("Opa! Seu pedido já está pronto para retirada! 🏪");
                }
                return r.join("\n");
              }}
            />
            <Li
              text="Msg pro entregador"
              msg={() => {
                const r = [];
                r.push(
                  join([
                    `*Cliente:* 🧑 ${pedido.cliente.nome}`,
                    `*Telefone:* 📱 ${pedido.cliente.whatsapp}`,
                  ]),
                );

                if (pedido.tipo === "entrega" && pedido.endereco) {
                  r.push(`*Endereço:* 🏍️`);
                  r.push(getEnderecoText(true));
                } else if (pedido.tipo === "retirada") {
                  r.push(`Pedido para retirada: 🏪`);
                }

                r.push(`*Itens:* 🍕`);
                r.push(getItensText());

                const { valorTotalComDescontos } = obterValoresDoPedido(pedido);

                r.push(`----------------`);
                r.push(`*Total: ${formatCurrency(valorTotalComDescontos)}* 💰`);
                r.push(`----------------`);

                if (pedido.pagamentos.length) {
                  r.push(`*Pagamento:*`);
                  r.push(getPagamentosText());
                }

                const message = `Olá, aqui é o entregador da Pizzaria Delicia da Bahia\n`;

                const url = `https://api.whatsapp.com/send?phone=${phoneForWhatsapp()}&text=${encodeURIComponent(message)}`;

                r.push(`*Cliente:* 🧑 ${pedido.cliente.nome}`);
                r.push(`Whatsapp: ${url}`);

                return r.join("\n\n");
              }}
            />
          </ul>
        </MensagemStyle>
      </ModalContainer>
    </ModalOverlay>
  );
};
