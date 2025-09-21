import { colors } from "@styles/colors";
import { breakpointsMQ } from "@styles/mediaQueries";
import styled from "styled-components";

export const BairroViewStyle = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;

  .bairros {
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow-y: auto;
    padding: 5px;

    .bairro {
      padding: 20px 10px;
      color: #fff;
      background-color: ${colors.backgroundDark};
      border-radius: 5px;
      text-align: center;
    }
  }

  @media ${breakpointsMQ.desktopSmUp} {
    width: 500px;
    justify-self: center;
  }
`;
