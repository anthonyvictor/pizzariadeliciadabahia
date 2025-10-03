import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import styled from "styled-components";
import { Produto } from "../../styles";

export const SaboresViewStyle = styled(LayoutStyle)`
  .categorias {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 5px;
    li {
      display: flex;
      white-space: nowrap;
      padding: 10px;
      color: #fff;
      gap: 10px;
      border-radius: 5px;
      background-color: ${colors.backgroundDark}80;
      border: 2px solid ${colors.backgroundDark}80;

      &.active {
        color: #000;
        background-color: ${colors.elements};
        border: 2px solid ${colors.elements};
      }
      &.inactive {
        background-color: #000;
        border: 2px solid #000;
        /* border: 2px solid #000; */
      }
    }
  }

  .bottom-info {
    color: #fff;
    padding: 5px;
    border-top: 1px solid #000;
    background-color: ${colors.backgroundDark};
  }
`;

export const SaborItemStyle = styled(Produto)``;
