import styled from "styled-components";

export const MetodoModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;

  .valor-total {
    display: flex;
    align-items: end;

    .myInput {
      flex: 1;
    }

    button {
      background-color: transparent;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 7px;
      margin-bottom: 5px;

      border: 2px solid #000;
    }
  }

  .cupom {
    text-align: center;
  }
`;
