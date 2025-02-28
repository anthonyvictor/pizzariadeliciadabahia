import { breakpointsMQ } from "@styles/mediaQueries";
import styled from "styled-components";

export const ModalCardsStyle = styled.div`
  display: flex;
  min-height: 200px;
  width: 100%;
  gap: 1rem;

  @media ${breakpointsMQ.desktopSmUp} {
    min-height: 280px;
    flex-direction: row;
  }

  .card {
    flex: 1;
    height: 100%;
    width: 100%;
    background-color: #ffffff15;
    padding: 10px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: #fff;
    white-space: nowrap;

    &.disabled {
      opacity: 0.5;
      cursor: default;
    }
    &:hover:not(.disabled) {
      transform: scale(105%);
      background-color: #ffffff40;
    }
    border-radius: 10px;
    .img {
      position: relative;
      aspect-ratio: 1;
      flex: 1;

      img {
        object-fit: scale-down;
      }
    }
  }
`;
