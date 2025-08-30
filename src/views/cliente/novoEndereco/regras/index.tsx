import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { RegrasViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";

export const RegrasView = () => {
  const router = useRouter();

  return (
    <RegrasViewStyle>
      <main className="no-scroll">
        <TextContainer
          title="Orientações para entrega"
          description="Para uma melhor experiência na entrega!  🛵⚡"
        />

        <p>
          Para garantir um serviço mais rápido e seguro pedimos que sigam as
          orientações abaixo:
        </p>

        <ol>
          <li>
            <strong className="titulo">Detalhe seu endereço:</strong>
            <br />
            Insira informações detalhadas no endereço. Informe{" "}
            <strong>pontos de referência</strong> para que nossos entregadores
            cheguem o mais rápido possível.
          </li>
          {/* <li>
            <strong className="titulo">Escadarias e ladeiras íngremes:</strong>
            <br />
            Por questões operacionais e de segurança,{" "}
            <strong>
              não estamos realizando entregas subindo ou descendo escadarias
            </strong>
            , nem em ladeiras muito íngremes onde o acesso por moto ou bicicleta
            seja inviável.
          </li> */}

          {/* <li>
            <strong className="titulo">Endereço em rua principal:</strong>
            <br />
            Informe uma <strong>rua principal, de fácil acesso</strong>.
            <br />
            Nossos entregadores <strong>não entram em becos</strong>, vielas,
            terrenos de difícil acesso ou áreas com risco à segurança.
          </li> */}

          <li>
            <strong className="titulo">Contato:</strong>
            <br />
            Fique atento ao telefone. É essencial que informe o whatsapp correto
            pois o entregador entrará em contato.
          </li>

          <li>
            <strong className="titulo">Edifícios e condomínios:</strong>
            <br />
            Em caso de edifícios ou condomínios, o local de entrega, será{" "}
            <strong>na portaria</strong>.<br />
          </li>

          <li>
            <strong className="titulo">Recebimento:</strong>
            <br />
            Garanta que alguém esteja disponível para receber o pedido no local
            e horário. Após tentativas de contato sem sucesso, o entregador
            retornará com o pedido.
          </li>
        </ol>

        <p>
          <strong>
            Nosso compromisso é levar seu pedido e dos demais clientes com
            agilidade e eficiência. Lembre-se que quando se tem dificuldades com
            uma entrega, as entregas seguintes podem atrasar, inclusive uma
            delas pode ser a sua. Contamos com sua colaboração!
          </strong>
        </p>
      </main>

      <BottomControls
        secondaryButton={{
          text: "Voltar",
          click: () => {
            sessionStorage.removeItem("endereco");
            router.back();
          },
        }}
        primaryButton={{
          text: "Confirmar",
          click: () => {
            router.push("/cliente/novo-endereco/complemento");
          },
        }}
      />
    </RegrasViewStyle>
  );
};
