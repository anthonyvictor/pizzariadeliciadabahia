import styled from "styled-components";
import { breakpointsMQ } from "@styles/mediaQueries";
import { sizes } from "@styles/sizes";

export const HeaderStyle = styled.header`
  display: flex;
  justify-content: space-between;
  /* padding: 1rem 1rem; */
  gap: 2rem;
  height: ${sizes.header}px;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;

  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);

  .img {
    position: relative;
    width: 80px;
    height: 100%;
  }

  .nome {
    color: #fff;
    align-self: center;
  }

  .peca-ja-button {
    display: none;
  }

  @media ${breakpointsMQ.tablet} {
    .peca-ja-button {
      order: -1;
    }
  }
  @media ${breakpointsMQ.tabletUp} {
    .peca-ja-button {
      display: block;
    }
  }
`;
