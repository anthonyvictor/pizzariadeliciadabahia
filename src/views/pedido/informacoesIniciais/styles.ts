import { breakpointsMQ } from "@styles/mediaQueries";
import styled from "styled-components";

export const InformacoesIniciaisStyle = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  gap: 20px;
  padding: 10px 5px;

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 50px;
    min-height: 0;
    overflow-y: auto;

    .nome-sobrenome {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
  }

  @media ${breakpointsMQ.desktopSmUp} {
    width: 500px;
    justify-self: center;
  }
`;
