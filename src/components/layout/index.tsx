import { Footer } from "../footer";
import { Header } from "../header";
import Page from "../page";
import { LayoutStyle } from "./styles";
// import { useEffect, useState } from "react";
// import Loading from "@components/loading";

export default function Layout({ children }) {
  //   const [status, setStatus] = useState<'carregando'|'aberto'|'fechado'>('carregando');
  //   useEffect(() => {

  //        const obterConfigs = async () => {
  //       if (!clienteId) return null;
  //       const res = await axios.get(`${env.apiURL}/configs`);
  //       return res.data as IConfig[];
  //     };

  //     const configs = await obterConfigs();
  //     const configHorarioFunc = configs.find(
  //       (x) => x.chave === "horario_funcionamento"
  //     )?.valor;

  //     const _fechado = configHorarioFunc
  //       ? !analisarRegrasTempo(configHorarioFunc)
  //       : false;
  //     setFechado(_fechado);

  //   }, [])

  // if(status === 'carregando') return <Loading />
  return (
    <LayoutStyle>
      <Header />
      <Page>{children}</Page>
      <Footer />
    </LayoutStyle>
  );
}
