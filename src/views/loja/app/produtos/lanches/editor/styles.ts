import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import styled from "styled-components";

export const LancheViewStyle = styled(LayoutStyle)`
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
  .valores {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

export const ValorStyle = styled.div`
  display: flex;
  padding: 7px 5px;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background-color: ${colors.backgroundDark};
  border-radius: 5px;
`;
