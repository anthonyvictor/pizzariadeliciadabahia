import Text from "@components/text";
import { useEffect, useState, type FC } from "react";
import { LoadingStyle } from "./styles";
import ConsoleLogger from "./errorLog";

const Loading: FC = () => {
  const [erro, setErro] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate loading completion after 15 seconds

      setErro(
        "Ocorreu um erro ao carregar a página. Por favor, tente novamente mais tarde."
      );
    }, 15 * 1000);
  }, []);

  return erro ? (
    <LoadingStyle>
      <Text type="title" color="#fff">
        {erro}
      </Text>
      <hr />

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
