import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import styled from "styled-components";

export const TamanhoViewStyle = styled(LayoutStyle)`
  padding: 10px;
  overflow-y: auto;

  .img-nome-descricao-section {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .nome-descricao-section {
      flex-shrink: 1;
      min-width: 0;
    }
  }

  .info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3px;
  }
`;
