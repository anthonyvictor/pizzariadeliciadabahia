import { IBebida, ILanche, ICombo, IPizzaTamanho } from "tpdb-lib";
import { colors } from "@styles/colors";
import styled, { css } from "styled-components";

export const PedidoStyle = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 5px;
  padding: 10px 0 50px 0;
  position: relative;

  .menu {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 10px;
    min-height: 0;

    .uls {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
    }

    & > nav {
      display: flex;
      width: 100%;

      button {
        padding: 10px;
        background-color: transparent;
        border: none;
        color: #fff;
        flex: 1;
        font-size: 0.6rem;
        &:not(:last-child) {
          border-right: 2px solid #fff;
        }
      }
    }

    .cupom {
      align-self: center;
      color: #fff;
      a {
        color: ${colors.elements};
        font-weight: 800;
      }
    }
  }
`;

export const ProdCard = styled.li.attrs(
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
export const DestaqueLi = styled(ProdCard)`
  flex: 1;
  flex-direction: column;
  align-items: start;

  .prod-img {
    min-width: 100%;
    max-width: 100%;

    aspect-ratio: 1/1;
  }
`;

export const ComboLi = styled(ProdCard).attrs(
  (props: { combo: ICombo }) => props
)`
  /* flex: 1;
  flex-direction: column; */

  /* .prod-img {
    min-width: 100%;
    max-width: 100%;

    aspect-ratio: 1/1;
  } */

  .prod-img {
    width: 70px;
    height: 70px;
    aspect-ratio: 1/1;
  }
`;
export const TamanhoLi = styled(ProdCard).attrs(
  (props: { tamanho: IPizzaTamanho }) => props
)`
  .prod-img {
    width: 50px;
    height: 50px;
    aspect-ratio: 1/1;
  }
`;
export const BebidaLi = styled(ProdCard).attrs(
  (props: { bebida: IBebida }) => props
)`
  .prod-img {
    height: 60px;
    width: 40px;
  }
`;
export const LancheLi = styled(ProdCard).attrs(
  (props: { lanche: ILanche }) => props
)`
  .prod-img {
    width: 60px;
    height: 60px;

    aspect-ratio: 1/1;
  }
`;

export const ProdGrid = styled.div`
  display: grid;
  flex-wrap: wrap;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  min-height: min-content;
`;

export const ProdList = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
`;
export const ProdGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: min-content;

  & > header {
    color: #fff;
  }
`;
