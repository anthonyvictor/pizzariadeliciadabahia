import styled, { keyframes } from "styled-components";
import { breakpointsMQ } from "@styles/mediaQueries";
import { colors } from "@styles/colors";
import { animations } from "@styles/animations";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const CardapioContainer = styled.main`
  color: #ffffff;
  /* background-color: ${colors.background}; */
  /* min-height: 100vh; */
  padding: 1.5rem 0.3rem 3rem 0.3rem;
  /* max-width: 1280px; */
  margin: 0 auto;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;

  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  /* display: flex; */
  /* flex-direction: column; */
  /* padding: 3rem 0.3rem; */
  /* position: relative; */

  @media ${breakpointsMQ.tabletUp} {
    padding: 2.5rem 2rem 4rem 2rem;
  }
`;

export const HeaderSection = styled.header`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 800;
    color: ${colors.elements};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;

    @media ${breakpointsMQ.tabletUp} {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.85);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.4;

    @media ${breakpointsMQ.tabletUp} {
      font-size: 1.1rem;
    }
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 1.25rem;
    background-color: ${colors.elements};
    border-radius: 2px;
  }
`;

export const SizesSlider = styled.div`
  display: flex;
  gap: 0.85rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 190, 24, 0.3);
    border-radius: 4px;
  }

  @media ${breakpointsMQ.tabletUp} {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    overflow-x: visible;
  }
`;

export const SizeCard = styled.div`
  flex: 0 0 78%;
  scroll-snap-align: start;
  background: linear-gradient(
    145deg,
    ${colors.backgroundDark}80,
    ${colors.background}90
  );
  border: 1px solid rgba(255, 190, 24, 0.2);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    border-color: ${colors.elements};
    transform: translateY(-2px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;

    .name {
      font-size: 1.1rem;
      font-weight: 700;
      color: ${colors.elements};
    }

    .fatias {
      font-size: 0.85rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 20px;
    }
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const CalculationNotice = styled.div`
  background: rgba(94, 1, 1, 0.6);
  border: 1px dashed ${colors.elements};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: #ffffff;
  margin-bottom: 2rem;

  b {
    color: ${colors.elements};
  }
`;

export const SearchAndFilter = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: ${colors.backgroundDark};
    color: #ffffff;
    font-size: 0.95rem;
    outline: none;

    &:focus {
      border-color: ${colors.elements};
      box-shadow: 0 0 0 2px rgba(255, 190, 24, 0.2);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const FlavorsGrid = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  min-height: 200px;

  @media ${breakpointsMQ.tabletSmUp} {
    grid-template-columns: repeat(3, 1fr);
  }

  @media ${breakpointsMQ.desktopSmUp} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const FlavorCard = styled.li`
  background-color: ${colors.backgroundDark};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.3s ease-out forwards;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }

  .image-wrapper {
    width: 100%;
    height: 160px;
    background-color: rgba(0, 0, 0, 0.2);
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      background: radial-gradient(
        circle,
        ${colors.backgroundLight} 0%,
        ${colors.backgroundDark} 100%
      );
    }

    .badge-bestseller {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: ${colors.elements};
      color: ${colors.backgroundDark};
      border: 3px solid ${colors.backgroundDark};
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
  }

  .content {
    padding: 0.7rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.2rem;

    h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      /* margin-bottom: 0.35rem; */
    }

    p {
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.35;
      /* margin-bottom: 1rem; */
      flex: 1;
    }
  }

  .prices-container {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.75rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;

    .price-tag {
      background-color: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      display: flex;
      gap: 0.3rem;

      .size-name {
        color: rgba(255, 255, 255, 0.6);
      }

      .price-value {
        color: ${colors.elements};
        font-weight: 700;
      }
    }
  }
  .price-only {
    font-size: 0.75rem;
    color: ${colors.elements};
    font-weight: 700;
    padding: 0 1rem 0.75rem 1rem;
  }

  @media ${breakpointsMQ.tabletSmUp} {
    .content {
      p {
        font-size: 0.75rem;
      }
    }
  }

  @media ${breakpointsMQ.desktopSmUp} {
    .content {
      p {
        font-size: 0.85rem;
      }
    }
  }
`;
