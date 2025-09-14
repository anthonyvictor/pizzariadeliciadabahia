import { FooterStyle } from "./styles";
import Facebook from "@assets/images/footer-icon-facebook.svg";
import Instagram from "@assets/images/footer-icon-instagram.svg";
import Whatsapp from "@assets/images/footer-icon-whatsapp.svg";
import Clock from "@assets/images/clock.svg";
import { env } from "@config/env";
import Image from "next/image";
import { useRouter } from "next/router";

export const Footer = () => {
  const router = useRouter();

  if (["/cardapio-", "/loja"].some((x) => router.pathname.includes(x)))
    return <></>;

  // useEffect(() => {})
  return (
    <FooterStyle>
      <span className="content icons">
        <a
          rel="noreferrer"
          target={router.pathname.includes("/pedido") ? "_self" : "_blank"}
          aria-label="Link para o whatsapp da pizzaria"
          href={
            router.pathname.includes("/pedido")
              ? "#"
              : encodeURI(
                  `https://api.whatsapp.com/send?${
                    env.whatsapp ? `phone=${env.whatsapp}&` : ""
                  }text=Olá, gostaria de fazer um pedido! 🍕`
                )
          }
        >
          <Image
            alt="link to our whatsapp chat"
            title="Whatsapp"
            layout="fill"
            src={Whatsapp.src}
          />
        </a>
        <a
          rel="noreferrer"
          target={router.pathname.includes("/pedido") ? "_self" : "_blank"}
          aria-label="Link para o facebook da pizzaria"
          href={
            router.pathname.includes("/pedido")
              ? "#"
              : "https://www.facebook.com/pizzadeliciadabahia"
          }
        >
          <Image
            alt="link to our facebook profile"
            title="Facebook"
            layout="fill"
            src={Facebook.src}
          />
        </a>
        <a
          rel="noreferrer"
          target={router.pathname.includes("/pedido") ? "_self" : "_blank"}
          aria-label="Link para o instagram da pizzaria"
          href={
            router.pathname.includes("/pedido")
              ? "#"
              : "https://www.instagram.com/pizzadeliciadabahia"
          }
        >
          <Image
            alt="link to our instagram page"
            title="Instagram"
            layout="fill"
            src={Instagram.src}
          />
        </a>
      </span>
      <span className="content text onlyprint">
        <div className="worktime">
          <span className="left">
            <img
              alt="our working time"
              title="Horario"
              width={40}
              height={40}
              src={Clock.src}
            />
          </span>
          <span className="right">
            <h3>TER-DOM</h3>
            <p>18:30-23:30</p>
          </span>
        </div>
        <div className="social">
          <h4>@pizzadeliciadabahia</h4>
          <h6>www.pizzariadeliciadabahia.com</h6>
        </div>
      </span>
    </FooterStyle>
  );
};
