import Head from "next/head";
import Layout from "@components/layout";
import NavigationProvider from "@context/navigationContext";
import Globals from "@styles/globals";
import Favicon from "../../public/favicon.ico";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-number-input/style.css";
import "leaflet/dist/leaflet.css";
import superjson from "superjson";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@components/loading";
import { useInactivityTimer } from "@util/hooks/inactivity";
import styled from "styled-components";
import { useModoStore } from "src/infra/zustand/modo";
import TextContainer from "@components/textContainer";
import { ButtonSecondary } from "@styles/components/buttons";
import BottomControls from "@components/pedido/bottomControls";

export default function App({ Component, pageProps }) {
  let finalProps = pageProps;

  if (pageProps?.__superjson) {
    finalProps = superjson.deserialize({
      json: pageProps.props,
      meta: pageProps.meta,
    });
  }

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { modo } = useModoStore();
  const novoPedido = () => {
    localStorage.removeItem("pedidoId");
    localStorage.removeItem("clienteId");
    if (router.pathname !== "/pedido") {
      router.replace("/pedido").then(() => router.reload());
    } else {
      router.reload();
    }
  };
  const { showWarning, countdown } = useInactivityTimer(
    {
      warningVisible() {
        console.log("modo, router.pathname", modo, router.pathname);
        return (
          modo === "autoatendimento" && router.pathname.startsWith("/pedido")
        );
      },
      onTimeout: () => {
        if (
          modo === "autoatendimento" &&
          router.pathname.startsWith("/pedido")
        ) {
          novoPedido();
        }
      },
    },
    [modo, router.pathname]
  );

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href={Favicon.src} />
        <link rel="manifest" href="/manifest.json" />
        <title>Pizzaria Delicia da Bahia - a melhor de Salvador</title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content={`Pizzaria Delicia da Bahia, desde 2013 servindo alegria!`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no maximum-scale=1.0"
        />
      </Head>
      <>
        <NavigationProvider>
          <Layout>
            {showWarning && router.pathname.startsWith("/pedido") && (
              <Inatividade>
                <TextContainer
                  title="Oi, você ainda tá aí?"
                  subtitle=""
                  description={`Você tem ${countdown}s para continuar com seu pedido, ou o app vai voltar para a tela inicial!`}
                />
                <BottomControls
                  secondaryButton={{
                    text: "Iniciar novo pedido",
                    click: () => {
                      novoPedido();
                    },
                  }}
                  primaryButton={{
                    text: "Continuar",
                    click: () => {},
                    fixed: true,
                  }}
                />
              </Inatividade>
            )}
            {loading ? <Loading /> : <Component {...finalProps} />}
          </Layout>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            closeOnClick
            theme="colored"
            className="toast"
          />
        </NavigationProvider>
      </>
      {/* @ts-expect-error bug de tipagem do styled-components */}
      <Globals />
    </>
  );
}

const Inatividade = styled.div`
  background-color: #000000f0;
  position: fixed;
  z-index: 999;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  padding: 25px;
  backdrop-filter: blur(10px);
`;
