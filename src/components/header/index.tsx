import { HeaderStyle } from "./styles";
import { Logo } from "./logo";
import { Navigation } from "./navigation";
import { PecaJaButton } from "../pecaja";
import { useRouter } from "next/router";
import Image from "next/image";
import _Logo from "@assets/images/logo.svg";
import { useClienteStore } from "src/infra/zustand/cliente";
import { capitalize } from "@util/format";

export const Header = () => {
  const router = useRouter();
  const { cliente } = useClienteStore();
  if (["/cardapio-"].some((x) => router.pathname.includes(x))) return <></>;
  return (
    <HeaderStyle>
      <div className="img">
        <Image
          src={_Logo}
          alt="Logo Delicia da bahia, 
              contém um chapéu estilo 
              Toque-Blanche, a palavra 
              'Delicia' escrito em vermelho, 
              e o complemento 'da bahia', 
              logo abaixo, escrito em preto. 
              De cada lado há dois ornamentos 
              retangulares azuis curvados para 
              baixo de forma contrária"
          layout="fill"
        />
      </div>

      {["/pedido", "/cliente"].some((x) => router.pathname.startsWith(x)) &&
        !!cliente?.id && (
          <h5 className="nome">
            Olá, {capitalize(cliente.nome.split(" ")[0])}!
          </h5>
        )}

      <Navigation />
      <PecaJaButton style="minimal" />
    </HeaderStyle>
  );
};
