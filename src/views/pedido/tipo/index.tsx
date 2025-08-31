import { TipoViewStyle } from "./styles";
import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import BottomControls from "@components/pedido/bottomControls";
import axios from "axios";
import { env } from "@config/env";
import { toast } from "react-toastify";
import { ICupom } from "tpdb-lib";
import { IPedido } from "tpdb-lib";
import { Endereco } from "./components/endereco";
import { EnderecoStyle } from "./components/endereco/styles";
import Modal from "@components/modal";
import { MdDeliveryDining } from "react-icons/md";
import { GiStairsGoal } from "react-icons/gi";
import { ButtonSecondary } from "@styles/components/buttons";
import { Metodo } from "./components/metodo";
import { useTipoPage } from "./context";
import { useEffect } from "react";

export const TipoView = () => {
  const router = useRouter();
  const { tipo, setTipo, pedido } = useTipoPage();

  return (
    <TipoViewStyle>
      <menu className="no-scroll">
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

        <EnderecoStyle
          onClick={() => router.push("/cliente/novo-endereco")}
          className={`item`}
        >
          <aside className="item-left">
            <h2 className="item-type">Novo endereço 🛵</h2>

            <small className="item-description">
              {"Cadastre seu endereço clicando aqui".toUpperCase()}
            </small>
          </aside>
          <aside className="item-right">
            <p className="item-price"></p>
          </aside>
        </EnderecoStyle>

        <ul className="tipos">
          {(pedido?.cliente?.enderecos ?? []).map((e) => (
            <Endereco key={e.id} e={e} />
          ))}
        </ul>
      </menu>

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

      {tipo?.type === "entrega" && !!tipo.endereco && !tipo.endereco.metodo && (
        <Modal
          label="Método de entrega"
          description="Como você quer sua entrega?"
          type="custom"
          buttons={
            <ButtonSecondary onClick={() => setTipo(null)}>
              Voltar
            </ButtonSecondary>
          }
        >
          <div className="metodos">
            <Metodo
              metodo="basico"
              nome="Na rua principal"
              descricao="Vou encontrar o entregador na rua principal, em local acessível para moto/bicicleta."
              Icone={MdDeliveryDining}
              taxa={tipo.endereco?.enderecoOriginal?.taxa ?? 0}
              desconto={tipo.endereco.desconto ?? 0}
            />
            <Metodo
              metodo="avancado"
              nome="Com trecho a pé"
              descricao="Quero que  entregador desembarque do veículo e se desloque à pé até o local da entrega"
              Icone={GiStairsGoal}
              taxa={(tipo.endereco?.enderecoOriginal?.taxa ?? 0) * 3}
              desconto={0}
            />
          </div>
        </Modal>
      )}
    </TipoViewStyle>
  );
};
