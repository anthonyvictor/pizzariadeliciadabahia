import { colors } from "@styles/colors";
import styled from "styled-components";

export const RegrasViewStyle = styled.main`
  height: 100%;
  gap: 10px;
  padding: 10px 0 50px 0;
  color: #fff;
  display: flex;
  flex-direction: column;

  & > main {
    padding: 0 0 50px 0;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;

    overflow-y: auto;

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

  .complemento-numero {
    display: grid;
    grid-template-columns: 1fr 80px;
  }
`;
