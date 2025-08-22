import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { ConfirmacaoRuaViewStyle } from "./styles";
import { IEndereco } from "tpdb-lib";
import { useEffect, useState } from "react";
import BottomControls from "@components/pedido/bottomControls";
import Loading from "@components/loading";

export const ConfirmacaoRuaView = () => {
  const router = useRouter();
  const [endereco, setEndereco] = useState<IEndereco>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _endereco = JSON.parse(sessionStorage.getItem("endereco") ?? "{}");
    if (!_endereco?.cep) {
      router.back();
    } else {
      setEndereco(_endereco);
      setLoading(false);
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <ConfirmacaoRuaViewStyle>
      {!!endereco?.cep && (
        <>
          <TextContainer title="Confirma o endereço?" />

          <h4 className="endereco">
            {[endereco.rua, endereco.bairro, endereco.cep]
              .filter(Boolean)
              .join(", ")}
          </h4>
          <BottomControls
            primaryButton={{
              text: "Confirmar",
              click: () => {
                sessionStorage.setItem("endereco", JSON.stringify(endereco));
                router.replace("/cliente/novo-endereco/complemento");
              },
            }}
          />
        </>
      )}
    </ConfirmacaoRuaViewStyle>
  );
};
