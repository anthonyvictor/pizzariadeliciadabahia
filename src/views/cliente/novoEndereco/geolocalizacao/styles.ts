import styled from "styled-components";

export const GeolocalizacaoStyle = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 20px;

  color: #fff;

  .continuar-carregando {
    span {
      opacity: 0;
      animation: dots 1.5s infinite;
    }

    span:nth-child(2) {
      animation-delay: 0.2s;
    }
    span:nth-child(3) {
      animation-delay: 0.4s;
    }
    span:nth-child(4) {
      animation-delay: 0.6s;
    }
  }

  @keyframes dots {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;
