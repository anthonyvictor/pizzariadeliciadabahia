import { ReactNode, useEffect, useState } from "react";
import { GeolocalizacaoStyle } from "./styles";
import { useRouter } from "next/router";
import { ButtonPrimary } from "@styles/components/buttons";
import Loading from "@components/loading";
import { useTimer } from "@util/hooks/timer";

export const GeolocalizacaoView = () => {
  const router = useRouter();

  const [buttonText, setButtonText] = useState<ReactNode>(<>Continuar</>);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { start, reset, running, timeLeft } = useTimer();

  const salvarGeoLoc = (loc: [number, number] | null) => {
    if (!loc) {
      sessionStorage.removeItem("geoLoc");
    } else {
      sessionStorage.setItem("geoLoc", JSON.stringify(loc));
    }
  };

  const avancar = () => {
    router.replace("/cliente/novo-endereco/rua");
  };

  const [status, setStatus] = useState<"checking" | "prompt" | "denied">(
    "checking"
  );

  useEffect(() => {
    if (status === "denied") avancar();
  }, [status]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }

    const obterPosicao = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          salvarGeoLoc([position.coords.latitude, position.coords.longitude]);
          avancar();
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          setStatus("prompt");
        }
      );
    };

    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          // já tem permissão, pega localização automaticamente
          obterPosicao();
        } else if (result.state === "prompt") {
          setStatus("prompt");
        } else {
          setStatus("denied");
        }

        // atualiza se a permissão mudar
        result.onchange = () => {
          if (result.state === "granted") {
            obterPosicao();
          } else if (result.state === "prompt") {
            setStatus("prompt");
          } else {
            setStatus("denied");
          }
        };
      });
    } else {
      // fallback se Permissions API não suportada
      setStatus("prompt");
    }
  }, [salvarGeoLoc]);

  if (status === "checking") return <Loading />;

  if (status === "denied")
    return <p>Geolocalização não disponível neste dispositivo.</p>;

  // status === "prompt" → mostra botão para solicitar
  const solicitarPermissao = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        salvarGeoLoc([position.coords.latitude, position.coords.longitude]);
        avancar();
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        // avancar()
      }
    );
  };

  // if (loading || loadingPermission) return <Loading />;

  return (
    <GeolocalizacaoStyle>
      <h1>Permita o acesso à localização</h1>
      <p>
        Para obtermos uma localização mais precisa do seu endereço, conceda
        acesso à localização
      </p>
      <ButtonPrimary
        className="continuar-carregando"
        disabled={buttonDisabled}
        onClick={() => {
          setButtonDisabled(true);
          setButtonText(
            <>
              Carregando<span>.</span>
              <span>.</span>
              <span>.</span>
            </>
          );
          start(10, () => {
            avancar();
          });
          solicitarPermissao();
        }}
      >
        {buttonText}
      </ButtonPrimary>
    </GeolocalizacaoStyle>
  );
};
