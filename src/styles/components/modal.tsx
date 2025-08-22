import { colors } from "@styles/colors";
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #00000099;
  inset: 0;
  z-index: 999;
  backdrop-filter: blur(5px);
  padding: 20px;
`;
export const ModalContainer = styled.div`
  background-color: ${colors.background};
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  /* max-width: 90vw; */
`;
