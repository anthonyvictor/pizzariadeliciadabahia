import styled, { css } from "styled-components";

export const ProdutosStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: min-content;

  & > header {
    color: #fff;
  }
`;

export const ProdutoStyle = styled.li.attrs(
  (props: { disabled: boolean }) => props
)`
  /* background-color: #00000005; */
  color: #fff;
  padding: 5px;
  border-radius: 10px;
  display: flex;
  gap: 5px;
  display: flex;
  align-items: center;

  .prod-img {
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    border: 2px solid #000;
    overflow: hidden;
    flex-shrink: 0;
    img {
      display: none;
      background-color: #fff;
      border-radius: 10px;
      transform: scale(102%);
      transform-origin: center center;
      flex-shrink: 0;
    }
  }

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
    `}
`;

export const Grid = styled.div`
  display: grid;
  flex-wrap: wrap;
  grid-template-columns: repeat(3, 1fr);
  list-style: none;
  min-height: min-content;
  padding: 0 15px;
  gap: 5px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
`;
