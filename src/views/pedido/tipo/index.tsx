import { TipoViewStyle } from "./styles";
import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { ICliente } from "tpdb-lib";
import { formatCurrency } from "@util/format";
import BottomControls from "@components/pedido/bottomControls";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "@config/env";
import { toast } from "react-toastify";
import { IEndereco } from "tpdb-lib";
import { Checker } from "@components/checker";
import { ICupom } from "tpdb-lib";
import { obterDescontos, obterValorDescontoReal } from "@util/cupons";
import { IPedido } from "tpdb-lib";
import { Endereco } from "./endereco";
import { Tipo } from "./types";
import { EnderecoStyle } from "./endereco/styles";
import { colors } from "@styles/colors";
export const TipoView = ({
  pedido,
  cupomEntrega,
}: {
  pedido: IPedido;
  cupomEntrega: ICupom | null;
}) => {
  const router = useRouter();
  const [tipo, setTipo] = useState<Tipo>();

  return (
    <TipoViewStyle>
      <TextContainer
        title="Opções de entrega"
        subtitle="Escolha uma das opções abaixo:"
      />

      <EnderecoStyle
        onClick={() => setTipo({ type: "retirada" })}
        className={`item ${tipo?.type === "retirada" ? "checked" : ""}`}
      >
        <aside className="item-left">
          <h2 className="item-type">Retirar na pizzaria 🍕</h2>

          <small className="item-description">
            {"Ladeira do Jardim Zoológico, 427-B, Ondina".toUpperCase()}
          </small>
        </aside>
        <aside className="item-right">
          <p className="item-price">
            <b className="free-price">GRÁTIS!</b>
          </p>
        </aside>
      </EnderecoStyle>

      <button
        className="cadastrar-endereco"
        onClick={() => router.push("/cliente/novo-endereco")}
      >
        Cadastrar um novo endereço
      </button>

      <ul className="tipos no-scroll">
        {!!pedido.cliente?.enderecos?.length && (
          <>
            <h2
              className="item-type"
              style={{
                fontSize: "1rem",
                color: colors.elements,
                padding: "10px",
              }}
            >
              Entrega 🛵
            </h2>
            {pedido.cliente.enderecos.map((e) => (
              <Endereco
                key={e.id}
                e={e}
                tipo={tipo}
                setTipo={setTipo}
                cupomEntrega={cupomEntrega}
              />
            ))}
          </>
        )}
      </ul>

      <BottomControls
        secondaryButton={{
          click: () => router.back(),
          text: "Voltar",
        }}
        primaryButton={{
          disabled: !tipo,
          click: () => {
            if (tipo) {
              axios
                .post(`${env.apiURL}/pedidos/tipo`, {
                  pedidoId: pedido.id,
                  novoTipo: tipo.type,
                  novoEndereco:
                    tipo.type === "entrega" ? tipo.endereco : undefined,
                })
                .then(() => {
                  router.push("/pedido/confirmacao");
                })
                .catch((err) => {
                  console.error(err);
                  toast.error(
                    "Oops, houve um erro interno, informe à pizzaria"
                  );
                });
            } else {
              toast.error("Selecione uma opção de entrega!");
            }
          },
          text: "Continuar",
        }}
      />
    </TipoViewStyle>
  );
};
