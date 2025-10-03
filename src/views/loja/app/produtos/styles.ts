import styled, { css } from "styled-components";
import { LojaLayout } from "../../layout";
import { colors } from "@styles/colors";
import { hover } from "@styles/mediaQueries";
import { IProdutoBase } from "tpdb-lib";

export const ProdutosViewStyle = styled(LojaLayout)`
  gap: 5px;
  min-height: 0;
  overflow-y: auto;
`;

export const Produto = styled.li.attrs(
  (props: { item: IProdutoBase }) => props
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
    (!item.disponivel || !item.visivel) &&
    css`
      opacity: 0.6;
    `}
`;
