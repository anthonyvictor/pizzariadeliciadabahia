import { colors } from "@styles/colors";
import styled from "styled-components";

export const MapaStyle = styled.div`
  background-color: ${colors.background};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;

  p {
    text-align: center;
  }
`;
