import { useRouter } from "next/router";
import {
  PageStyle,
  PageStyleWithoutElements,
  PageStyleWithoutHeader,
} from "./styles";
import ConsoleLogger from "@components/consoleLogger";

export default function Page({ children }) {
  const router = useRouter();
  if (["/cardapio-"].some((x) => router.pathname.includes(x)))
    return <PageStyleWithoutElements>{children}</PageStyleWithoutElements>;
  if (["/loja"].some((x) => router.pathname.includes(x)))
    return <PageStyleWithoutHeader>{children}</PageStyleWithoutHeader>;
  return (
    <PageStyle>
      {children}
      <ConsoleLogger />
    </PageStyle>
  );
}
