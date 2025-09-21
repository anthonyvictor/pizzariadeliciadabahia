import styled from "styled-components";
import { breakpointsMQ, hover } from "@styles/mediaQueries";
import { colors } from "@styles/colors";

export const ItensStyle = styled.main`
  display: flex;
  flex-direction: column;
  padding: 10px 5px 50px 5px;
  gap: 0.5rem;
  height: 100%;

  .itens {
    display: flex;
    flex-direction: column;
    gap: 5px;
    list-style: none;
    min-height: 0;
    overflow-y: auto;
  }

  .menu {
    flex-grow: 1;
    flex-shrink: 0;
    width: 100%;
    margin-bottom: calc(50px + 10px);
    position: relative;
    ul {
      padding: 0.3rem;
      position: absolute;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      li {
        background-color: ${colors.elements};
        display: flex;
        padding: 0.5rem;
        gap: 0.5rem;
        border-radius: 1rem;

        .left {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .item-title {
            font-size: min(1.5rem, 5vw);
          }
          .item-subtitle {
            font-size: min(1.2rem, 3vw);
          }
          .item-info {
            font-size: min(1.3rem, 3.2vw);
          }
          .item-obs {
            font-size: min(1rem, 3vw);
            color: ${colors.background};
          }
        }
        .right {
          display: flex;
          align-items: center;
          justify-content: center;
          button {
            background-color: transparent;
            border: none;
            border-radius: 50%;
            background-color: ${colors.background};
            color: #fff;
            flex-grow: 0;
            flex-shrink: 0;
            width: min(4rem, 10vw);
            height: min(4rem, 10vw);
            font-size: min(2rem, 5vw);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
        }
        .subdiv {
          display: flex;
          gap: 0.5rem;
          align-items: center;

          .subleft {
            img {
              border: 2px solid #000;
              background-color: #fff;
              object-fit: scale-down;
              border-radius: 6px;
              padding: 0.2rem;
            }
          }
        }
      }
    }
  }

  @media ${breakpointsMQ.desktopSmUp} {
    .menu {
      ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: max-content;
      }

      ul:has(li:only-child) {
        grid-template-columns: 1fr;
      }
    }
  }

  @media ${breakpointsMQ.tabletSmUp} {
    width: 500px;
    justify-self: center;
  }
`;
