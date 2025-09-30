import styled from "styled-components";
import { LojaLayout } from "../../layout";
import { breakpointsMQ } from "@styles/mediaQueries";

export const HomeViewStyle = styled(LojaLayout)`
  min-height: 0;
  overflow-y: auto;
  gap: 20px;

  > ul {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  @media ${breakpointsMQ.desktopSmUp} {
    > ul {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 150px);
      align-items: stretch;
      justify-items: stretch;
    }
  }
`;
