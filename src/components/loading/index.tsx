import Text from "@components/text";
import { useEffect, useState, type FC } from "react";
import { LoadingStyle } from "./styles";
import ConsoleLogger from "../consoleLogger";

const Loading: FC = () => {
  const [erro, setErro] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate loading completion after 15 seconds
      setErro(
        "Parece que está demorando muito para carregar. Verifique sua conexão com a internet ou contate o suporte."
      );
    }, 15 * 1000);

    return () => clearTimeout(timer);
  }, []);

  return erro ? (
    <LoadingStyle>
      <Text type="title" color="#fff">
        {erro}
      </Text>

      <ConsoleLogger />
    </LoadingStyle>
  ) : (
    <LoadingStyle>
      <Text type="title" color="#fff">
        Carregando...
      </Text>
      <span className="lds-dual-ring" />
    </LoadingStyle>
  );
};
export default Loading;
