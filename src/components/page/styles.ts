import styled from "styled-components";
import { sizes } from "@styles/sizes";

export const PageStyle = styled.main`
  flex-grow: 1;
  z-index: 1;
  height: calc(100% - ${sizes.header}px - ${sizes.footer}px);
  width: 100%;
  top: ${sizes.header}px;
  /* padding-bottom: ${sizes.footer}px;
  padding-top: ${sizes.header}px; */
  position: fixed;
  /* background-color: blue; */
`;

export const PageStyleWithoutHeader = styled.main`
  flex-grow: 1;
  z-index: 1;
  height: calc(100% - ${sizes.header}px);
  width: 100%;
  top: ${sizes.header}px;
  position: fixed;
`;
export const PageStyleWithoutElements = styled.main`
  z-index: 1;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  position: fixed;
  padding: 1rem;
`;
