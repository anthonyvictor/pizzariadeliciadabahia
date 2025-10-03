import { colors } from "@styles/colors";
import styled, { css } from "styled-components";

export const ProdutosStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: min-content;

  & > header {
    color: #fff;
  }

  .mostrar-indisponiveis {
    background-color: transparent;
    border: none;
    color: ${colors.elements};
    padding: 5px 0;
  }
`;

export const ProdutoStyle = styled.li.attrs(
  (props: { disabled: boolean }) => props
)`
  /* background-color: #00000005; */
  color: #fff;
  padding: 5px;
  gap: 5px;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  background-color: ${colors.backgroundDark}80;

  .prod-img {
    position: relative;
    background-color: #fff;
    border-radius: 5px;
    /* border: 2px solid #000; */
    overflow: hidden;
    flex-shrink: 0;
    img {
      display: none;
      overflow: hidden;
      /* background-color: #fff; */
      border-radius: 10px;
      transform: scale(106%);
      transform-origin: center center;
      flex-shrink: 0;
    }
  }
  .conteudo {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .descricao {
    font-size: 0.6rem;
    opacity: 0.8;
  }

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`;

export const Grid = styled.div.attrs((props: { cols: number }) => props)`
  display: grid;
  flex-wrap: wrap;
  grid-template-columns: repeat(${(props) => props.cols ?? 4}, 1fr);
  list-style: none;
  min-height: min-content;
  /* padding: 0 15px; */
  gap: 5px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 5px;
`;
