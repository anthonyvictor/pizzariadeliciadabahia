import React from "react";
import { NextPage } from "next";
import {
  SobreContainer,
  SocialFrameWrapper,
  ContentSection,
} from "@styles/pages/sobre/styles";

const Sobre: NextPage = () => {
  return (
    <SobreContainer>
      <SocialFrameWrapper>
        <div className="card-frame">
          <iframe
            id="frame"
            src="https://www.instagram.com/p/B5GnxoQnH6o/embed"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            title="Instagram da Pizzaria Delícia da Bahia"
          />
        </div>
      </SocialFrameWrapper>

      <ContentSection>
        <div className="title-wrapper">
          <span className="subtitle">Nossa História</span>
          <h1>Quem Somos</h1>
        </div>

        <div className="text-body">
          <p className="lead">
            Nascida em Janeiro de 2013, a <b>Pizzaria Delícia da Bahia</b>{" "}
            conquista seus clientes através de um trabalho de excelência,
            prezando por superar expectativas.{" "}
            <span className="founder">Antônio</span>, juntamente com sua esposa{" "}
            <span className="founder">Elisandra</span>, foram os responsáveis
            por dar início a um sonho que se tornou realidade com muita
            dedicação de todos os envolvidos.
          </p>

          <p className="highlight-box">
            Nosso foco está em surpreender você com sabores deliciosos a massa
            leve e fofinha, bem recheada e suculenta, além de entrega ágil e
            atendimento rápido.
          </p>

          <p>
            Buscamos renovar continuamente nosso cardápio para trazer novidades
            exclusivas, aprimorando cada detalhe dos nossos produtos para
            garantir uma experiência inesquecível.
          </p>

          <p>
            Conheça nossas opções e peça seu delivery no conforto do seu lar!
          </p>
        </div>
      </ContentSection>
    </SobreContainer>
  );
};

export default Sobre;
