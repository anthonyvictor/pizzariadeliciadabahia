import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import { breakpointsMQ, hover } from "@styles/mediaQueries";
import styled, { css } from "styled-components";
import { IConfig } from "tpdb-lib";

export const ConfigsViewStyle = styled(LayoutStyle)`
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

export const ConfigItemStyle = styled.li.attrs(
  (props: { item: IConfig }) => props
)`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-self: stretch;
  align-self: stretch;
  color: #fff;
  gap: 10px;
  border-radius: 5px;
  background-color: ${colors.backgroundDark}80;
  .esq {
    display: flex;
    gap: 5px;
    align-items: center;
    .estoque {
      zoom: 0.8;
    }
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

  ${hover} {
    &:hover {
      background-color: #00000080;
    }
  }

  ${({ item }) =>
    item.chave === "entrega" &&
    css`
      opacity: 1;
    `}
`;

export const ConfigsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 0;
  flex: 1;
  padding: 5px;
`;
