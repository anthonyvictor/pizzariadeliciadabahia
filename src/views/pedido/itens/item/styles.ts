import { colors } from "@styles/colors";
import styled from "styled-components";

export const ItemStyle = styled.li`
  display: flex;
  background-color: ${colors.backgroundDark}80;
  padding: 10px;
  color: #fff;
  gap: 10px;
  align-items: center;
  justify-content: center;
  /* border-bottom: 1px solid #000; */

  .imagem {
    position: relative;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 40px;
    height: 40px;
    flex-grow: 0;
    flex-shrink: 0;
    aspect-ratio: 1/1;
    border-radius: 5px;
    /* overflow: hidden; */
    background-color: #fff;
    img {
      border-radius: 5px;
      transform: scale(101%);
    }
    .numero {
      z-index: 1;
      background-color: ${colors.background};
      color: #fff;
      border-radius: 50%;
      padding: 3px;
      text-align: center;
      border: 1px solid #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translate(-50%, 50%) scale(75%);
    }
  }
  .info {
    flex: 1;

    .nome {
      font-size: 0.8rem;
    }
    .descricao {
      font-size: 0.6rem;
    }
    .subdescricao {
      font-size: 0.6rem;
      opacity: 0.8;
    }
  }
  .excluir {
    background-color: transparent;
    color: #fff;
    border: none;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  .item-price {
    display: flex;
    flex-direction: column;
    font-size: 1.2rem;
    align-items: end;
    .price {
      display: flex;
      flex-direction: column;
      align-items: end;
      justify-content: center;
      font-size: 1rem;

      .price-title {
        font-size: 0.6rem;
      }
    }
    .original-price {
      font-size: 0.8rem;
    }
    .free-price {
      color: ${colors.checkedLight};
    }
  }

  .observacoes {
    font-size: 0.5rem;
  }
`;
