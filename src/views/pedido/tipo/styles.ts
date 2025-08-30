import styled from "styled-components";

export const TipoViewStyle = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 50px 20px;
  /* margin-bottom: 50px; */
  gap: 15px;

  menu {
    gap: 15px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .metodos {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 5px;
  }

  .tipos {
    /* flex: 1; */
    height: max-content;
    display: flex;
    flex-direction: column;
    list-style: none;
    gap: 10px;
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
