import styled, { css } from "styled-components";
import { breakpointsMQ } from "@styles/mediaQueries";
import mobileShape from "@assets/pages/home/home-shape-center-mobile.svg";
import tabletShape from "@assets/pages/home/home-shape-center-tablet.svg";
import desktopShape from "@assets/pages/home/home-shape-center-desktop.svg";
import { sizes } from "@styles/sizes";
import { animations } from "@styles/animations";

export const HomeStyle = styled.main`
  flex-grow: 1;
  flex-shrink: 0;
  height: 100%;
  background-image: url(${mobileShape.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 50% 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 4rem 0.5rem;
  /* background-color: blue; */

  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    /* background-color: pink; */

    .text-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text {
        white-space: nowrap;
        line-height: 100%;
      }

      .little-text {
        font-size: min(2rem, 6vw);
        font-weight: 100;
        letter-spacing: 1rem;
      }
      .large-text {
        font-size: min(4.2rem, 15vw);
        letter-spacing: 0.3rem;
      }
    }

    .peca-ja-button {
      z-index: 1;
      position: absolute;
      bottom: 0;
    }
  }

  .right {
    pointer-events: none;
    user-select: none;
    flex-grow: 1;
    /* background-color: green; */
    .image-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      transform: scale(130%);
      .pizza-image {
        object-fit: contain;
        animation: ${animations.floatingSkew} infinite 5.3s ease-in-out;
      }
    }
  }

  @media ${breakpointsMQ.mobile} {
    .right {
      .image-wrapper {
        transform: scale(115%) translateY(-1rem);
        .pizza-image {
        }
      }
    }
  }
  @media ${breakpointsMQ.tablet} {
    background-position: 50% 80%;
    background-image: url(${tabletShape.src});
  }

  @media ${breakpointsMQ.tabletUp} {
    .left {
      .text-container {
        .little-text {
          font-size: 3rem;
          letter-spacing: 1.7rem;
        }
        .large-text {
          font-size: 7rem;
          letter-spacing: 0.3rem;
        }
      }
    }
  }

  @media ${breakpointsMQ.desktopSmUp} {
    display: grid;
    grid-template-columns: 0.6fr 1fr;
    background-image: url(${desktopShape.src});
    background-position: 100% 100%;
    padding: 4rem;

    .left {
      align-items: flex-start;
      .peca-ja-button {
        position: inherit;
      }
    }

    .right {
      .image-wrapper {
        transform: scale(130%);
      }
    }
  }

  @media ${breakpointsMQ.desktopMdUp} {
    .right {
      .image-wrapper {
        transform: scale(150%);
      }
    }
  }
  @media ${breakpointsMQ.tvSmUp} {
    background-position: 100% 100%;
    .left {
      padding-bottom: 10rem;
    }
    .right {
      .image-wrapper {
        transform: scale(130%);
      }
    }
  }

  @media ${breakpointsMQ.tvMdUp} {
    background-position: 100% 110%;
    .left {
      padding-bottom: 7rem;
      .text-container {
        .little-text {
          font-size: 3rem;
        }
        .large-text {
          font-size: 7rem;
        }
      }
    }
  }
  @media ${breakpointsMQ.tvLg} {
    background-position: 100% 110%;
    .left {
      .text-container {
        .little-text {
          font-size: 7.5rem;
        }
        .large-text {
          font-size: 13rem;
        }
      }
    }
  }
`;
