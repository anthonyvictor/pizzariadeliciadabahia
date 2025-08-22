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
          content={`Pizzaria Delicia da Bahia,
            desde 2013, servindo as pizzas mais
            deliciosas de Salvador!`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no maximum-scale=1.0"
        />
      </Head>
      <>
        <NavigationProvider>
          <Layout>
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
