import styled from "styled-components";
import { ProdutoStyle } from "../styles";

export const DestaqueStyle = styled(ProdutoStyle)`
  flex: 1;
  flex-direction: column;
  align-items: start;

  .prod-img {
    min-width: 100%;
    max-width: 100%;

    aspect-ratio: 1/1;
  }
`;
