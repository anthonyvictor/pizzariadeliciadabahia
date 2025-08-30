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
    overflow: hidden;
    background-color: #fff;
    img {
      transform: scale(101%);
    }
  }
  .info {
    flex: 1;

    .nome {
      font-size: 1rem;
    }
    .descricao {
      font-size: 0.8rem;
    }
    .subdescricao {
      font-size: 0.6rem;
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

      .price-title {
        font-size: 0.7rem;
      }
    }
    .original-price {
      font-size: 0.9rem;
    }
    .free-price {
      color: ${colors.checkedLight};
    }
  }
`;
