import styled from "styled-components";

export const TipoViewStyle = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 50px 20px;
  gap: 10px;

  .tipos {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    list-style: none;
    overflow-y: auto;
    gap: 5px;
  }

  .sem-enderecos {
    color: #fff;
    padding: 10px;
    text-align: center;
  }

  .cadastrar-endereco {
    padding: 2px;
    align-self: center;
    border: none;
    width: max-content;
    /* border-radius: 5px; */
    color: #fff;
    border-bottom: 1px solid #fff;
    background-color: transparent;
  }
`;
