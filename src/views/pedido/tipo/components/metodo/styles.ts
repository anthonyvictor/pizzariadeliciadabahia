import { colors } from "@styles/colors";
import styled from "styled-components";

export const MetodoStyle = styled.button`
  display: flex;
  flex-direction: column;
  text-align: left;
  border-radius: 5px;
  border: none;
  padding: 10px;
  background-color: ${colors.backgroundDark}70;
  /* border: 2px solid #fff; */
  color: #fff;
  gap: 5px;
  aside {
    display: flex;
    align-items: center;
    gap: 5px;
    svg {
      font-size: 2rem;
    }

    .nome {
    }
    .descricao {
      font-size: 0.8rem;
      width: 100%;
      white-space: normal;
      word-wrap: break-word;
      word-break: break-word;
      /* word-spacing: 1rem; */
      overflow-wrap: break-word;
      /* text-align: justify; */
      /* text-justify: auto; */
    }
    .valor {
      color: ${colors.checkedLight};
    }
  }

  .icone-nome {
  }
  .descricao-valor {
    flex-direction: column;
    align-items: start;
  }
`;
