import { colors } from "@styles/colors";
import styled from "styled-components";

export const EnderecoStyle = styled.li`
  list-style: none;
  /* background-color: ${colors.backgroundDark}; */
  color: #fff;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 10px;

  .item-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .item-right {
    display: flex;
    align-items: center;
    justify-content: right;
    gap: 5px;
  }

  .item-type {
    font-size: 1rem;
    color: ${colors.elements};
    padding: 5px 0;
  }
  .item-title {
    font-size: 0.7rem;
  }
  .item-description {
    font-size: 0.6rem;
  }
  .item-price {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    align-items: end;
    .price {
    }
    .original-price {
      font-size: 0.8rem;
    }
    .free-price {
      color: ${colors.checkedLight};
    }
  }

  &.checked {
    background-color: ${colors.backgroundDark}95;
  }
`;
