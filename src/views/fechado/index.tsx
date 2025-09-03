import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { FechadoViewStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { IConfig, IConfigHorarioFuncionamento } from "tpdb-lib";
import { useEffect } from "react";

export const FechadoView = ({ configs }: { configs: IConfig[] }) => {
  const router = useRouter();

  const horario = configs.find((x) => x.chave === "horario_funcionamento")
    ?.valor as IConfigHorarioFuncionamento;

  useEffect(() => {
    const handlePopState = () => {
      return false; // impede a navegação normal
    };

    router.beforePopState(handlePopState);

    return () => {
      // importante: volta o comportamento ao padrão quando desmontar
      router.beforePopState(() => true);
    };
  }, [router]);

  return (
    <FechadoViewStyle>
      <main className="no-scroll">
        <TextContainer
          title="Opa, estamos fechados!"
          description={
            horario?.fechadoAte
              ? `Retornamos em ${horario.fechadoAte.toLocaleString("pt-BR", {
                  dateStyle: "long",
                  timeStyle: "full",
                })}`
              : horario?.descricao
              ? horario.descricao
              : "Fique de olho em nossas redes sociais para atualizações!"
          }
        />
      </main>
    </FechadoViewStyle>
  );
};
