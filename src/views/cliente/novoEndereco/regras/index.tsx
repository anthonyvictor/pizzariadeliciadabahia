import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { RegrasViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";

export const RegrasView = () => {
  const router = useRouter();

  // const [endereco, setEndereco] = useState<IEndereco>();

  // const [loading, setLoading] = useState(true);
  // const [descontoReal, setDescontoReal] = useState<number>(0);

  // useEffect(() => {
  //   const _endereco = JSON.parse(sessionStorage.getItem("endereco") ?? "{}");
  //   if (!_endereco?.cep) {
  //     router.back();
  //   } else {
  //     axios
  //       .post(`${env.apiURL}/enderecos/completo`, {
  //         endereco: _endereco,
  //       })
  //       .then((res) => {
  //         const enderecoCompleto = res.data;
  //         setEndereco(enderecoCompleto);

  //         if (cupomAplicavel(cupom, enderecoCompleto)) {
  //           const _descontoReal = obterValorDescontoReal(
  //             enderecoCompleto.taxa ?? 0,
  //             cupom.valor,
  //             cupom.tipo,
  //             cupom.maxDesconto
  //           );

  //           setDescontoReal(_descontoReal);
  //         }
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.error("Não foi possível obter a taxa de entrega");
  //         setEndereco(_endereco);
  //         setLoading(false);
  //       });
  //   }
  // }, []);

  // const Metodo = ({
  //   nome,
  //   descricao,
  //   Icone,
  //   taxa,
  //   desconto,
  // }: {
  //   nome: string;
  //   descricao: string;
  //   Icone: IconType;
  //   taxa: number;
  //   desconto?: number;
  // }) => {
  //   return (
  //     <MetodoStyle>
  //       <aside className="icone-nome">
  //         {<Icone />}
  //         <h3 className="nome">{nome}</h3>
  //       </aside>
  //       <aside className="descricao-valor">
  //         <p className="descricao">{descricao}</p>
  //         <span
  //           className="valor"
  //           // style={{
  //           //   color:
  //           //     valor && descontoReal
  //           //       ? colors.checkedLight
  //           //       : valor
  //           //       ? colors.elements
  //           //       : "transparent",
  //           // }}
  //         >
  //           Taxa: {formatCurrency(taxa - desconto)}
  //         </span>
  //       </aside>
  //     </MetodoStyle>
  //   );
  // };

  // if (loading) return <Loading />;
  // if (!endereco.cep) return <></>;

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
            router.push("/cliente/novo-endereco/confirmacao");
          },
        }}
      />
    </RegrasViewStyle>
  );
};
