import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ComplementoViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { MyInput } from "@components/pedido/myInput";
import { IEnderecoCliente } from "tpdb-lib";
import Loading from "@components/loading";

export const ComplementoView = ({
  endereco: _endereco,
}: {
  endereco: IEnderecoCliente;
}) => {
  const router = useRouter();

  const [endereco, setEndereco] = useState<IEnderecoCliente>(_endereco);

  if (!endereco?.enderecoOriginal?.cep)
    return (
      <ComplementoViewStyle>
        <h3 style={{ color: "#ffd000" }}>Erro ao carregar endereço</h3>
      </ComplementoViewStyle>
    );

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
            router.push("/cliente/novo-endereco/confirmacao");
          },
        }}
      />
    </ComplementoViewStyle>
  );
};
