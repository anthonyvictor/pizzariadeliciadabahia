import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import { hover } from "@styles/mediaQueries";
import styled, { css } from "styled-components";
import { IPedido } from "tpdb-lib";

export const PedidosViewStyle = styled(LayoutStyle)``;

export const PedidoItemStyle = styled.li.attrs(
  (props: { pedido: IPedido }) => props,
)`
  display: flex;
  height: 100%;
  background-color: ${colors.backgroundDark}80;

  ${hover} {
    .sidebar {
      visibility: hidden;
    }
    &:hover {
      background-color: #00000080;

      .sidebar {
        visibility: visible;
      }
    }
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* padding: 0 10px 10px 10px; */
    justify-self: stretch;
    align-self: stretch;
    color: #fff;
    gap: 10px;
    border-radius: 5px;
    background-color: ${colors.backgroundDark}80;

    header {
      display: flex;
      justify-content: space-between;
      background-color: ${colors.backgroundDark}80;
      align-items: center;
      padding: 10px;

      .ped-duracao {
        display: flex;
        align-items: center;
        gap: 5px;
        .ped-data-cor {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          flex-grow: 0;
          border-radius: 50%;
          /* padding: 5px; */
          border: 2px solid #000000;
        }
      }
    }

    footer {
      display: flex;
      justify-content: space-between;
      background-color: ${colors.backgroundDark}80;
      align-items: center;
      padding: 10px;
    }

    .endereco {
      padding: 0 10px;
      .endereco-texto {
        font-size: 0.8rem;
        opacity: 0.8;
      }
    }

    .itens {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      gap: 5px;
      padding: 5px 10px;
      min-height: 50px;
      .item {
        display: flex;
        gap: 5px;
        align-items: center;
        border-bottom: 1px solid ${colors.backgroundDark}80;
        /* background-color: ${colors.backgroundDark}80; */
        padding: 5px;

        &.outro {
          /* opacity: 0.9; */
          color: #c4c4c4;
        }

        .esq {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
          .nome {
            display: flex;
            gap: 5px;
          }
          .descricao {
            font-size: 0.8rem;
            opacity: 0.8;
          }
          .checkers {
            zoom: 0.8;
          }
          footer {
            display: flex;
            gap: 5px;
          }
        }
        .dir {
          display: flex;
          gap: 5px;
          align-items: center;
          .estoque {
            zoom: 0.8;
          }
        }
      }
    }
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    height: 170px;
    max-height: 170px;

    button {
      padding: 5px 15px;
      flex: 1;
      font-size: 1.2rem;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #000000;
      color: #fff;

      &:disabled {
        opacity: 0.6;
        pointer-events: none;
      }

      ${hover} {
        &:hover {
          background-color: #00000080;
        }
      }
    }
  }
`;

//   ${({ pedido }) =>
//     (!pedido.disponivel || !pedido.visivel) &&
//     css`
//       opacity: 0.6;
//     `}

export const MensagemStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;

  ul {
    gap: 5px;
    list-style: none;
    display: flex;
    flex-direction: column;
    li {
      padding: 20px 10px;
      border-radius: 5px;
      border: none;
      background-color: ${colors.backgroundDark}80;
      color: #fff;
      font-size: 1.2rem;

      &.disabled {
        opacity: 0.6;
        pointer-events: none;
      }
    }
  }
`;
