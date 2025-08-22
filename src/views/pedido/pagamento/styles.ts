import { colors } from "@styles/colors";
import styled from "styled-components";

export const PagamentoViewStyle = styled.main`
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 50px 10px;
  gap: 5px;

  .menu {
    flex: 1;
    display: flex;
    min-height: 0;
    overflow-y: auto;
    .metodos {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
`;
