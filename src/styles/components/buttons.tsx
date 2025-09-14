import styled, { css } from "styled-components";
import { animations } from "@styles/animations";
import { colors } from "@styles/colors";
import { breakpointsMQ, hover } from "@styles/mediaQueries";
import { sizes } from "@styles/sizes";

export const Button = styled.button.attrs(
  (props: { bgcolor?: string; forecolor?: string }) => props
)`
  padding: 0.8rem 1rem;
  border: 3px solid black;
  font-size: min(0.9rem, 4vw);
  margin: 0 0.5rem;
  border-radius: 2rem;
  font-weight: bold;
  position: relative;
  transition: all linear 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) => props.forecolor ?? "#000"};
  background-color: ${(props) => props.bgcolor ?? "#fff"};

  &:not(:disabled) {
    cursor: pointer;
    ${hover} {
      &:hover {
        transform: scale(110%);
      }
    }
  }
  &:disabled {
    pointer-events: none;
    user-select: none;
    opacity: 0.6;
  }

  @media ${breakpointsMQ.tabletUp} {
    font-size: 1rem;
    padding: 1rem 1.5rem;
  }
`;

export const ButtonPrimary = styled(Button).attrs(
  (props: { pulse: boolean }) => props
)`
  position: relative;
  background-color: ${colors.elements};
  color: ${colors.background};
  border: 5px solid ${colors.elements};
  transform: scale(1);

  ${(props) =>
    props.pulse === false
      ? css`
          animation: none;
        `
      : css`
          &.pulse,
          &:not(:disabled) {
            animation: ${animations.pulse(colors.elements)} 2s ease-in-out
              infinite;
          }
        `}
`;

export const ButtonSecondary = styled(Button)`
  position: relative;
  border: 5px solid ${colors.elements};
  background-color: transparent;
  color: ${colors.elements};
  background-color: transparent;
`;

export const FloatButton = styled.button`
  position: fixed;
  bottom: 0;
  right: 0;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  margin: 0 30px 30px 0;
  background-color: ${colors.elements};
  border: 3px solid ${colors.backgroundDark};
  opacity: 0.8;
  padding: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: "+";
    font-size: 1.5rem;
    font-weight: 800;
  }

  &.hidden {
    display: none;
  }
`;
