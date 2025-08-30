import { sizes } from "@styles/sizes";
import styled from "styled-components";

export const ItemBuilderStyle = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  /* flex: 1; */
  min-height: 0;
  padding-top: ${sizes.header};
  & > .scrollable-area {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    overflow-y: auto;
    min-height: 0;
  }
`;
