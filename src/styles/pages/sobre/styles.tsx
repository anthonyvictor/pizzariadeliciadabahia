import styled from "styled-components";
import { breakpointsMQ } from "@styles/mediaQueries";
import { sizes } from "@styles/sizes";
import { colors } from "@styles/colors";

export const SobreContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  margin: 0 auto;
  padding: 2rem 1.25rem calc(${sizes.footer}px + 2rem) 1.25rem;
  overflow-y: auto;
  color: #ffffff;
  box-sizing: border-box;
  height: 100%;

  @media ${breakpointsMQ.tabletUp} {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    padding: 3rem 2rem;
  }

  @media ${breakpointsMQ.desktopSmUp} {
    gap: 4rem;
  }
`;

export const SocialFrameWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 340px;

  .card-frame {
    background-color: ${colors.backgroundDark};
    border: 1px solid rgba(255, 190, 24, 0.25);
    border-radius: 16px;
    padding: 0.75rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transition:
      transform 0.3s ease,
      border-color 0.3s ease;

    &:hover {
      border-color: ${colors.elements};
      transform: translateY(-4px);
    }

    iframe {
      border-radius: 12px;
      display: block;
      width: 320px;
      height: 480px;
      background: ${colors.backgroundDark};

      @media ${breakpointsMQ.mobile} {
        max-width: 100%;
        height: 420px;
      }
    }
  }

  @media ${breakpointsMQ.tabletUp} {
    transform: rotate(-2deg);
  }
`;

export const ContentSection = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .title-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    h1 {
      font-size: 1.8rem;
      font-weight: 800;
      color: ${colors.elements};
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0;

      @media ${breakpointsMQ.tabletUp} {
        font-size: 2.2rem;
      }
    }

    .subtitle {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }

  .text-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    line-height: 1.6;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.9);

    @media ${breakpointsMQ.tabletUp} {
      font-size: 1.05rem;
    }

    p {
      margin: 0;
    }

    p.lead::first-letter {
      font-size: 2.4rem;
      font-weight: 800;
      color: ${colors.elements};
      float: left;
      line-height: 1;
      margin-right: 0.5rem;
    }

    .founder {
      color: ${colors.elements};
      font-weight: 600;
      background: rgba(255, 190, 24, 0.1);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-style: normal;
    }

    .highlight-box {
      background-color: ${colors.backgroundDark};
      border-left: 3px solid ${colors.elements};
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      margin: 0.5rem 0;
      font-size: 0.95rem;
    }
  }
`;
