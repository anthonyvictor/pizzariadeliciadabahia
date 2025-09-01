import { useRouter } from "next/router";
import type { FC } from "react";
import { ErrorStyle } from "./styles";

interface ErrorProps {
  emoji: string;
  text: string;
}

const ErrorPage: FC<ErrorProps> = ({ emoji, text }) => {
  const router = useRouter();
  return (
    <ErrorStyle>
      <h1 className="icon">{emoji}</h1>
      <h1 className="title">{text}</h1>
      <a href="#" onClick={() => router.replace("/pedido")} className="link">
        Voltar
      </a>
    </ErrorStyle>
  );
};
export default ErrorPage;
