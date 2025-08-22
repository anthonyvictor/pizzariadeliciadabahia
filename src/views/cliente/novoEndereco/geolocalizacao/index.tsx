import { ReactNode, useEffect, useState } from "react";
import { GeolocalizacaoStyle } from "./styles";
import { useRouter } from "next/router";
import { ButtonPrimary } from "@styles/components/buttons";
import Loading from "@components/loading";

export const GeolocalizacaoView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const geoLoc = JSON.parse(sessionStorage.getItem("geoLoc") ?? "{}");
    if (geoLoc?.[0] && geoLoc?.[1])
      router.replace("/cliente/novo-endereco/rua");
    setLoading(false);
  }, []);

  const solicitarLocalizacao = () => {
    if (!navigator.geolocation) {
      sessionStorage.removeItem("geoLoc");
      console.error("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sessionStorage.setItem(
          "geoLoc",
          JSON.stringify([pos.coords.latitude, pos.coords.longitude])
        );
        router.replace("/cliente/novo-endereco/rua");
      },
      (err) => {
        if (err.code === 1) console.error("Permissão negada.");
        else if (err.code === 2) console.error("Localização indisponível.");
        else console.error("Erro desconhecido ao obter localização.");

        sessionStorage.removeItem("geoLoc");
        router.replace("/cliente/novo-endereco/rua");
      },
      {
        enableHighAccuracy: true, // mais rápido e consome menos bateria se false
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const [buttonText, setButtonText] = useState<ReactNode>(<>Continuar</>);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  if (loading) return <Loading />;

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
          solicitarLocalizacao();
        }}
      >
        {buttonText}
      </ButtonPrimary>
    </GeolocalizacaoStyle>
  );
};
