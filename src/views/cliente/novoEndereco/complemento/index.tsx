import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ComplementoViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { MyInput } from "@components/pedido/myInput";
import { ICupom, IEndereco } from "tpdb-lib";
import Loading from "@components/loading";
import { MyInputStyle } from "@components/pedido/myInput/styles";
import { GiStairsGoal } from "react-icons/gi";
import { MdDeliveryDining } from "react-icons/md";
import { IconType } from "react-icons";
import { formatCurrency } from "@util/format";
import { toast } from "react-toastify";
import axios from "axios";
import { env } from "@config/env";
import { obterValorDescontoReal } from "@util/cupons";
import { cupomAplicavel } from "@util/enderecos/cupomAplicave";
import { colors } from "@styles/colors";

export const ComplementoView = ({ cupom }: { cupom: ICupom | null }) => {
  const router = useRouter();

  const [endereco, setEndereco] = useState<IEndereco>();

  const [loading, setLoading] = useState(true);
  const [descontoReal, setDescontoReal] = useState<number>(0);

  useEffect(() => {
    const _endereco = JSON.parse(sessionStorage.getItem("endereco") ?? "{}");
    if (!_endereco?.cep) {
      router.back();
    } else {
      axios
        .post(`${env.apiURL}/enderecos/completo`, {
          endereco: _endereco,
        })
        .then((res) => {
          const enderecoCompleto = res.data;
          setEndereco(enderecoCompleto);

          if (cupomAplicavel(cupom, enderecoCompleto)) {
            const _descontoReal = obterValorDescontoReal(
              enderecoCompleto.taxa ?? 0,
              cupom.valor,
              cupom.tipo,
              cupom.maxDesconto
            );

            setDescontoReal(_descontoReal);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Não foi possível obter a taxa de entrega");
          setEndereco(_endereco);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <Loading />;
  if (!endereco.cep) return <></>;

  return (
    <ComplementoViewStyle>
      <main className="no-scroll">
        <TextContainer
          title="Complemento do endereço"
          description="Os campos com asterísco (*) são obrigatórios"
        />
        <MyInput
          name="Número"
          placeholder="3003-B"
          type="text"
          maxLength={6}
          value={endereco?.numero ?? ""}
          setValue={(value) =>
            setEndereco((prev) => ({ ...prev, numero: value as string }))
          }
        />
        <MyInput
          name="Complemento"
          placeholder="Nome do Edf, apart, bloco, etc. (Se houver)"
          maxLength={30}
          type="text"
          value={endereco?.local ?? ""}
          setValue={(value) =>
            setEndereco((prev) => ({ ...prev, local: value as string }))
          }
        />

        <MyInput
          name="Ponto de referência *"
          placeholder="Próx ao mercado tal.. atrás do posto de gasolina.."
          maxLength={90}
          type="text"
          value={endereco?.referencia ?? ""}
          setValue={(value) =>
            setEndereco((prev) => ({ ...prev, referencia: value as string }))
          }
        />
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
          disabled: !endereco.referencia,
          click: () => {
            sessionStorage.setItem("endereco", JSON.stringify(endereco));
            router.push("/cliente/novo-endereco/regras");
          },
        }}
      />
    </ComplementoViewStyle>
  );
};
