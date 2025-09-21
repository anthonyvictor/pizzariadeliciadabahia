import styled from "styled-components";
import { ProdutoStyle } from "../styles";

export const DestaqueStyle = styled(ProdutoStyle)`
  flex: 1;
  flex-direction: column;
  align-items: start;

  .prod-img {
    flex-shrink: 0;
    min-width: 100%;
    aspect-ratio: 1/1;
  }
  .prod-img::before {
    content: "";
    display: block;
    padding-bottom: 100%; /* 1:1 ratio */
  }

  .conteudo {
    gap: 2px;
    .nome {
      font-size: 0.6rem;
      /* word-break: break-all; */
    }
  }
`;
