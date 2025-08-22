import { colors } from "@styles/colors";
import { sizes } from "@styles/sizes";
import styled from "styled-components";

export const ComplementoViewStyle = styled.main`
  height: 100%;
  gap: 10px;
  padding: 0 0 50px 0;
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
`;
