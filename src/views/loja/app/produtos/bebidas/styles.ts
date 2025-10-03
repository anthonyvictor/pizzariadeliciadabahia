import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import { breakpointsMQ, hover } from "@styles/mediaQueries";
import styled from "styled-components";
import { Produto } from "../styles";

export const BebidasViewStyle = styled(LayoutStyle)`
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
`;

export const BebidaItemStyle = styled(Produto)``;
