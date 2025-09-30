import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { FechadoViewStyle } from "./styles";
import { IConfig, IConfigHorarioFuncionamento } from "tpdb-lib";
import { usePopState } from "@util/hooks/popState";

export const FechadoView = ({ configs }: { configs: IConfig[] }) => {
  const router = useRouter();

  const horario = configs.find((x) => x.chave === "horario_funcionamento")
    ?.valor as IConfigHorarioFuncionamento;

  usePopState(router);

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
