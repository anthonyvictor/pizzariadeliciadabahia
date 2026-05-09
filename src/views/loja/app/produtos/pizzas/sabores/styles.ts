import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import { hover } from "@styles/mediaQueries";
import styled, { css } from "styled-components";
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

  .ingredientes-indisponiveis {
    display: flex;
    flex-direction: column;
    padding: 5px;
    margin: 0 5px;
    border-radius: 5px;
    gap: 5px;
    background-color: ${colors.backgroundDark}80;

    .ingrs-titulo {
      font-size: 0.7rem;
      color: #fff;
    }
    .centro {
      display: flex;
      align-items: center;

      .add-ingrediente {
        background-color: ${colors.elements};
        color: ${colors.background};
        border: none;
        border-radius: 50%;
        font-size: 1rem;
        padding: 5px;
        margin: 0 10px 0 0;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          background-color: ${colors.elements}80;
          color: ${colors.elements};
        }
      }

      .ingredientes {
        list-style: none;
        flex: 1;
        height: 100%;
        display: flex;
        gap: 5px;
        .ingrediente {
          background-color: ${colors.backgroundDark}95;
          color: #fff;
          border-radius: 5px;
          border: 1px solid ${colors.backgroundDark};
          /* padding: 6px 5px; */
          display: flex;
          align-items: center;
          /* gap: 2px; */
          zoom: 0.75;

          div {
            padding: 6px 0 6px 5px;
            display: flex;
            align-items: center;
            gap: 2px;

            &:hover {
              color: ${colors.elements};
            }
          }

          .ingr-deletar {
            background-color: transparent;
            /* background-color: #ff0000; */
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            padding: 2px 10px;
            color: #fff;
            &:hover {
              color: ${colors.elements};
            }
          }
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

export const SaborItemStyle = styled(Produto).attrs(
  (props: { ingrEssencIndisp: boolean }) => props,
)`
  position: relative;
  .alerta {
    position: absolute;
    left: 0;
    top: 8px;
    font-size: 1.2rem;
  }
  ${({ ingrEssencIndisp }) =>
    ingrEssencIndisp === true &&
    css`
      opacity: 0.6;
    `}
`;

export const IngredientesStyle = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
  min-height: 0;
  height: min(800px, 80svh);
  width: min(500px, 80svw);

  @keyframes slideRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideLeft {
    from {
      opacity: 0;
      transform: translateX(-100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  main {
    display: flex;
    /* gap: 10px; */
    text-align: center;
    min-height: 0;
    flex: 1;
  }

  header {
    background-color: ${colors.backgroundDark};
    padding: 20px 10px;
    display: flex;

    .back-button {
      padding: 0 20px;
      background-color: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;

      ${hover} {
        &:hover {
          color: ${colors.elements};
        }
      }

      &.hidden {
        visibility: hidden;
      }
    }
    .header-title {
      /* color: #fff;
      font-size: 1.2rem; */
    }
  }

  aside {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .ul-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 10px;
    color: #fff;
    font-size: 0.8rem;

    h5 {
      background: ${colors.backgroundDark}80;
      padding: 5px 10px;
      border-radius: 5px;
    }
  }

  .dir {
    animation: slideLeft 0.2s ease-in-out;
  }

  .esq {
    background-color: ${colors.backgroundDark}40;
    border-right: 0.1rem solid rgba(255, 183, 176, 0.21);
    animation: slideRight 0.2s ease-in-out;

    nav {
      padding: 10px 5px;
      display: flex;
      gap: 5px;

      .search-wrapper {
        background: ${colors.backgroundDark};
        border: 1px solid #ffffff36;
        padding: 5px;
        border-radius: 5px;
        color: #fff;
        gap: 5px;
        display: flex;
        align-items: center;
        flex: 1;
        svg {
          color: #ffffff76;
          font-size: 0.6rem;
        }
        input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 0.7rem;
          caret-color: #fff;
          color: #fff;
          &::placeholder {
            color: #ffffff76;
          }
        }
      }

      button {
        background: ${colors.backgroundDark};
        border: 1px solid #ffffff36;
        padding: 5px;
        border-radius: 5px;
        color: #fff;
        gap: 5px;
        display: flex;
        align-items: center;
        font-size: 0.7rem;
        position: relative;
        cursor: pointer;

        svg {
          font-size: 0.6rem;
        }

        ${hover} {
          &:hover {
            &::after {
              position: absolute;
              content: "";
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              background-color: #ffffff10;
            }
          }
        }
      }
    }
  }

  footer {
    display: flex;
    gap: 1px;
    padding: 10px 10px;
    height: 60px;
    align-items: space-between;
    background-color: ${colors.backgroundDark};

    .footer-info {
      display: flex;
      align-items: center;
      color: #fff;
      flex: 1;
      gap: 5px;
      svg {
        font-size: 0.7rem;
      }
      p {
        font-size: 0.6rem;
      }
    }

    .footer-buttons {
      display: flex;
      justify-content: end;
      /* align-items: end; */
      flex: 1;
      gap: 5px;

      button {
        border-width: 1px;
        border-style: solid;
        border-radius: 5px;
        padding: 10px 15px;
        /* flex: 1; */
        color: #fff;
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        font-size: 0.75rem;
        position: relative;
        overflow: hidden;
        cursor: pointer;

        ${hover} {
          &:hover {
            &::after {
              position: absolute;
              content: "";
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              background-color: #ffffff10;
            }
          }
        }
      }
    }
  }

  .ingredientes {
    gap: 5px;
    list-style: none;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 5px 10px;

    li {
      padding: 20px 10px;
      display: flex;
      align-items: center;
      border-radius: 10px;
      overflow: hidden;
      border: none;
      background-color: ${colors.backgroundDark}50;
      border: 1px ${colors.backgroundDark};
      color: #fff;
      font-size: 1.2rem;
      flex-shrink: 0;

      .ingr-nome-subs {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        flex: 1;
        small {
          font-size: 0.8rem;
        }
      }

      .ingr-disp {
        font-size: 0.7rem;
        display: flex;
        align-items: center;
        gap: 10px;
        b {
          padding: 5px;
          border-radius: 3px;
        }
      }

      .controls {
        display: flex;
        height: 100%;
        animation: slideRight 0.2s ease-in-out;
        hr {
          border: 0.1px solid #ffffff36;
        }
        button {
          padding: 0 15px;
          flex: 1;
          height: 100%;
          border: none;
          background-color: transparent;
          font-size: 1rem;
          color: #fff;
          cursor: pointer;

          ${hover} {
            &:hover {
              color: ${colors.elements};
            }
          }
        }
      }

      ${hover} {
        &:hover {
          position: relative;
          background-color: ${colors.backgroundLight}80;

          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background-color: ${colors.backgroundLight};
          }
        }
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    min-height: 0;
    /* height: 100%; */
    flex: 1;

    .substituto-info {
      padding: 15px 20px 15px 10px;
      border-radius: 10px;
      border: 1px solid #ffffff36;
      display: flex;
      align-items: center;
      gap: 10px;
      text-align: start;

      svg {
        font-size: 1.2rem;
        color: #eeff00;
      }

      p {
        color: #fff;
        font-size: 0.6rem;
      }
    }

    .form-title {
      text-align: start;
      color: #fff;
      padding: 10px 0;
      display: flex;
      gap: 5px;
    }

    fieldset {
      border: none;
      padding: 2px;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      gap: 10px;

      input[type="text"] {
        /* border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
        flex: 1;
        width: 100%;
        font-size: 0.8rem; */

        background: ${colors.backgroundDark};
        border: 1px solid #ffffff36;
        padding: 5px;
        border-radius: 5px;
        color: #fff;
        gap: 5px;
        flex: 1;
        width: 100%;

        /* border: none; */
        font-size: 0.8rem;
        caret-color: #fff;

        &::placeholder {
          color: #ffffff76;
        }
      }

      label {
        color: #fff;
        font-size: 0.6rem;
        font-weight: bolder;
        letter-spacing: 0.5px;
      }
    }

    .wrapper-nome-disponivel {
      display: flex;
      gap: 5px;
      width: 100%;

      .wrapper-nome {
        flex: 1;
      }
      .wrapper-disponivel {
        display: flex;
        color: #fff;
        height: 100%;

        .wrapper-switch {
          display: flex;
          align-items: center;
          gap: 5px;

          .switch {
            zoom: 0.9;
          }
          .switch-title {
            font-size: 0.6rem;
            width: 50px;
            text-align: center;
          }
        }
      }
    }

    .utilizado-em {
      text-align: start;
      color: #fff;
      min-height: 0;

      display: flex;
      flex-direction: column;
      gap: 5px;
      .sabores {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
        padding: 10px 0;
        list-style: none;
        overflow: auto;
        min-height: 0;

        .sabor {
          padding: 5px;
          border-radius: 5px;
          border: 1px solid #ffffff36;
          font-size: 0.7rem;
        }
      }
    }
  }
`;
