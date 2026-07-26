import { NextPage } from "next";
import {
  MdOutlineDeliveryDining,
  MdOutlinePinDrop,
  MdCheckCircleOutline,
} from "react-icons/md";
import { FaMotorcycle, FaWhatsapp } from "react-icons/fa";
import { AreasEntregaStyle } from "@styles/pages/localizacao/styles";
import { env } from "process";

const bairrosPrincipais = [
  "Ondina",
  "Garcia",
  "Rio Vermelho",
  "Barra",
  "Vasco da Gama",
  "Garibaldi",
  "Pituba",
  "Federação",
  "Engenho Velho",
  "Amaralina",
  "Jardim Apipema",
  "Chame-Chame",
];

const bairrosSobConsulta = [
  "Canela",
  "C. Azul",
  "Brotas",
  "Politeama",
  "C. Grande",
  "Vitória",
];

const AreasEntrega: NextPage = () => {
  return (
    <AreasEntregaStyle>
      <header className="header-container">
        {/* <span className="badge">
          <MdOutlineDeliveryDining className="badge-icon" /> Somente Delivery
        </span> */}
        <h1 className="title">Áreas de Entrega</h1>
        <p className="subtitle">
          Entregamos sua pizza quentinha e no capricho direto na sua porta!
          Atendemos Ondina e bairros vizinhos.
        </p>
      </header>

      <div className="content-grid">
        {/* Mapa do Google focado na região central de Ondina/Salvador */}
        <div className="map-card">
          <div className="map-header">
            <MdOutlinePinDrop className="icon" />
            <span>Raio de até 5km (expansível até 7km)</span>
          </div>

          <div className="map-wrapper">
            <iframe
              title="Mapa de Área de Entrega - Ondina, Salvador"
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=-13.0080,-38.5085&t=&z=14&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Informações dos Bairros e Regras de Distância */}
        <div className="info-card">
          <div className="section-block">
            <h3>
              <MdCheckCircleOutline className="check-icon" /> Bairros Atendidos
            </h3>
            {/* <p className="description">Entrega rápida nas regiões:</p> */}
            <ul className="bairros-grid">
              {bairrosPrincipais
                .sort((a, b) => (a > b ? 1 : -1))
                .map((bairro) => (
                  <li key={bairro} className="bairro-item">
                    {bairro}
                  </li>
                ))}
            </ul>
          </div>

          <div className="section-block consult-block">
            {/* <h3>
              <FaMotorcycle className="moto-icon" /> Entregas Especiais (5km a
              7km)
            </h3> */}
            <p className="description">
              Mora um pouquinho mais distante? Dependendo do acesso, da
              localidade e do trânsito, entregamos até 7km!
            </p>
            <div className="chips-container">
              {bairrosSobConsulta.map((bairro) => (
                <span key={bairro} className="chip">
                  {bairro}
                </span>
              ))}
            </div>
            <a
              href={encodeURI(
                `https://api.whatsapp.com/send?${
                  env.whatsapp ? `phone=${env.whatsapp}&` : ""
                }text=Olá, gostaria saber se entrega no meu endereço`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              <FaWhatsapp className="wa-icon" /> Consultar Endereço no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </AreasEntregaStyle>
  );
};

export default AreasEntrega;
