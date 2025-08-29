import styled from "styled-components";

export const ConfirmacaoComplementoViewStyle = styled.main`
  height: 100%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  gap: 10px;
  color: #fff;
  text-align: center;
  padding: 20px 10px 60px 10px;

  .mapa-container {
    border-radius: 10px;
    overflow: hidden;
    background-color: #d2d2d2;
    display: flex;
    flex: 1;

    .mapa {
      border-radius: 10px;
      overflow: hidden;
      flex: 1;
      width: 100%;
    }
  }
`;
