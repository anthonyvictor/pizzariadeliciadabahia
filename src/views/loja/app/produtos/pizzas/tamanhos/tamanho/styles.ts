import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import styled from "styled-components";

export const TamanhoViewStyle = styled(LayoutStyle)`
  padding: 10px;

  .img-nome-descricao-section {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .nome-descricao-section {
      flex-shrink: 1;
      min-width: 0;
    }
  }

  .checkers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3px;
    > * {
      background-color: ${colors.backgroundDark};
      border-radius: 5px;
      padding: 5px;
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: center;
      label {
        font-size: 0.7rem;
      }
    }
  }
  .info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1px;
  }
`;
