import { colors } from "@styles/colors";
import styled from "styled-components";

export const ItemBuilderFooterStyle = styled.footer`
  padding: 10px;
  display: flex;
  gap: 10px;
  border-top: 2px solid ${colors.backgroundDark};

  .avancar {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    border: none;
    border-radius: 5px;
    background-color: ${colors.elements};
    color: #000;
  }
`;
