import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import styled from "styled-components";

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
  .sabores {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-height: 0;
    flex: 1;
    padding: 5px;

    li {
      display: flex;
      align-items: center;
      padding: 10px;
      color: #fff;
      gap: 10px;
      border-radius: 5px;
      background-color: ${colors.backgroundDark}80;
      .esq {
      }
      .dir {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .nome {
          display: flex;
          gap: 5px;
        }
        .checkers {
          zoom: 0.8;
        }
        footer {
          display: flex;
          gap: 5px;
        }
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
