import styled from "styled-components";
import { colors } from "@styles/colors";

export const LogoStyle = styled.div.attrs(
  (props: { menuOpen: boolean }) => props
)`
  position: absolute;
  z-index: 99;
  left: 0;
  top: 0;
  margin-left: 30px;
  width: min(6rem, 23vw);
  height: min(6rem, 23vw);
  transform: scale(110%);
  transform-origin: top;

  div {
    padding: 0px 5px 0.8rem 5px;
    clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
    background-color: ${colors.elements};
  }
  filter: drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.3));
`;
