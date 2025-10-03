import styled from "styled-components";
import { colors } from "@styles/colors";
import { breakpointsMQ, hover } from "@styles/mediaQueries";
import { sizes } from "@styles/sizes";
import MobileShape from "@assets/images/footer-shape-mobile.svg";
import TabletShape from "@assets/images/footer-shape-tablet.svg";
import DesktopShape from "@assets/images/footer-shape-desktop.svg";
import TvShape from "@assets/images/footer-shape-tv.svg";

export const FooterStyle = styled.footer`
  position: fixed;
  min-height: ${sizes.footer}px;
  bottom: 0px;
  width: 100vw;
  flex-shrink: 0;
  background-image: url(${MobileShape.src});
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: cover;
  background-position: 0% 0%;

  .content {
    position: absolute;
    display: flex;
    gap: 4rem;
    left: 50%;
    transform: translateX(-55%) rotate(1deg);
    bottom: 7px;

    a {
      position: relative;
      font-size: 2rem;
      width: 40px;
      height: 40px;
      color: ${colors.background};
      transition: all 0.2s ease-in-out;

      ${hover} {
        &:hover {
          transform: scale(120%);
        }
      }
    }
  }
  .line {
    position: absolute;
    left: 0;
    width: 100vw;
    transform: rotate(4deg) skew(4deg);
    background-color: ${colors.elements};
    display: flex;
    padding-left: 10vw;
    gap: 2px;
  }

  .first-line {
    height: 7px;
  }
  .second-line {
    /* background-color: blue; */
    height: 7px;
  }

  @media ${breakpointsMQ.tabletSmUp} {
    .content {
      transform: rotate(2deg);
      gap: 1.5rem;
      left: 10px;
      bottom: 7px;
    }
  }
  @media ${breakpointsMQ.tabletUp} {
    background-image: url(${TabletShape.src});

    .content {
      transform: rotate(3deg);
      bottom: 10px;
      a {
        font-size: clamp(5vmin, 50%, 2rem);
      }
    }
  }
  @media ${breakpointsMQ.desktopSmUp} {
    background-image: url(${DesktopShape.src});
    .content {
      transform: rotate(2deg);
      bottom: 10px;
    }
  }
  @media ${breakpointsMQ.tvSmUp} {
    background-image: url(${TvShape.src});
  }
  @media ${breakpointsMQ.tvLg} {
    .content {
      transform: rotate(1deg);
    }
  }

  @media print {
    background-image: url(${TabletShape.src});
    /* background-repeat: repeat-x; */
    min-height: calc(${sizes.footer}px + 10px);

    .icons {
      display: none;
    }

    .text {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 1rem;
      left: 0;
      transform: rotate(1deg);
      bottom: calc((${sizes.footer}px / 2) - (40px / 2) - 6px);
      margin-left: 1.2rem;
      * {
        color: ${colors.background};
      }
      .worktime {
        display: flex;
        gap: 2px;
        transform: rotate(1deg);
        .left {
          *,
          img,
          svg {
            color: ${colors.background};
            fill: ${colors.background};
          }
        }
      }
      .social {
        transform: rotate(1deg);
      }
    }
  }
`;
