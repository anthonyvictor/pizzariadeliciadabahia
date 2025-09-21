import { colors } from "@styles/colors";
import { breakpointsMQ } from "@styles/mediaQueries";
import styled from "styled-components";

export const ComplementoViewStyle = styled.main`
  height: 100%;
  gap: 10px;
  padding: 20px 10px 50px 10px;
  color: #fff;
  display: flex;
  flex-direction: column;

  & > main {
    padding: 0 0 50px 0;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;

    overflow-y: auto;
  }

  .complemento-numero {
    display: grid;
    grid-template-columns: 1fr 80px;
  }

  .metodos {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
  }
  .regras {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px;

    ol {
      display: flex;
      flex-direction: column;
      list-style: none;
      gap: 10px;
    }

    li,
    p {
      font-size: 0.8rem;
    }

    li {
      .titulo {
        color: ${colors.elements};
      }
    }
  }

  @media ${breakpointsMQ.desktopSmUp} {
    width: 500px;
    justify-self: center;
  }
`;
