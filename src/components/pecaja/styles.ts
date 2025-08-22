import styled from "styled-components";
import { colors } from "@styles/colors";
import { breakpointsMQ, hover } from "@styles/mediaQueries";

export const PecaJaButtonStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;

  button {
    padding: 0.7rem 2.5rem;
    border-radius: 200px;
    border: none;
    flex-grow: 0;
    background-color: ${colors.elements};
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.4);
    transition: all 0.2s ease-in-out;
    .title {
      color: ${colors.background};
      line-height: 100%;
      font-weight: bold;
      font-size: 1rem;
      padding-top: 5px;
    }

    &.large {
      padding: 0.5rem 2rem;
      .title {
        color: ${colors.background};
        font-weight: bolder;
        font-size: 1.5rem;
        white-space: nowrap;
      }
      .icon {
        font-size: 3rem;
        color: ${colors.background};
      }
    }

    ${hover} {
      &:hover {
        transform: scale(103%);
      }
    }
  }

  @media ${breakpointsMQ.tabletUp} {
    padding: 0.7rem 4rem;
  }
  @media ${breakpointsMQ.desktopSmUp} {
    .title {
      font-size: 2.5rem;
    }
    .icon {
      font-size: 3rem;
    }
  }
  @media ${breakpointsMQ.tvSmUp} {
    .title {
      font-size: 3rem;
    }
    .icon {
      font-size: 4rem;
    }
  }
  @media ${breakpointsMQ.tvLg} {
    .title {
      font-size: 6rem;
    }
    .icon {
      font-size: 7rem;
    }
  }
`;
