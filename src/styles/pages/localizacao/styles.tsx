import styled from "styled-components";
import { breakpointsMQ, hover } from "@styles/mediaQueries";
import { colors } from "@styles/colors";

export const AreasEntregaStyle = styled.main`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* margin: 0 auto; */
  padding: 1rem 1rem 2rem 1rem;
  color: #ffffff;
  overflow: auto;
  height: 100%;

  @media ${breakpointsMQ.tabletUp} {
    padding: 1rem 2rem 4rem 2rem;
  }

  .header-container {
    text-align: center;
    /* margin-bottom: 2rem; */
    display: flex;
    flex-direction: column;
    align-items: center;

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background-color: rgba(255, 190, 24, 0.15);
      color: ${colors.elements};
      border: 1px solid ${colors.elements};
      padding: 0.35rem 0.85rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      /* margin-bottom: 0.75rem; */

      .badge-icon {
        font-size: 1.2rem;
      }
    }

    .title {
      font-size: clamp(1.8rem, 5vw, 2.5rem);
      font-weight: 800;
      color: ${colors.elements};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 0.1rem 0;
    }

    .subtitle {
      font-size: clamp(0.95rem, 2.5vw, 1.1rem);
      color: rgba(255, 255, 255, 0.85);
      max-width: 600px;
      line-height: 1.4;
      margin: 0;
    }
  }

  .content-grid {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1.5rem;

    @media ${breakpointsMQ.desktopSmUp} {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 2rem;
      align-items: start;
    }
  }

  .map-card {
    background-color: ${colors.backgroundDark};
    border-radius: 16px;
    padding: 1rem;
    border: 1px solid rgba(255, 190, 24, 0.25);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
    height: 100%;
    s .map-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${colors.elements};
      font-weight: 700;
      font-size: 0.9rem;
      height: 100%;
      s .icon {
        font-size: 1.3rem;
        flex-shrink: 0;
      }
    }

    .map-wrapper {
      /* width: 100%; */
      /* height: 320px; */
      flex: 1;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;

      /* @media ${breakpointsMQ.tabletUp} {
        height: 100%;
      } */

      iframe {
        width: 100%;
        /* height: 100%; */
        flex: 1;
        border: none;
        filter: contrast(1.05) saturate(1.1);
      }
    }
  }

  .info-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .section-block {
      background-color: ${colors.backgroundDark};
      border-radius: 16px;
      padding: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.08);

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 0.2rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .check-icon {
          color: ${colors.checkedLight || "#75fc7c"};
          font-size: 1.3rem;
        }

        .moto-icon {
          color: ${colors.elements};
          font-size: 1.2rem;
        }
      }

      .description {
        font-size: 0.88rem;
        color: rgba(255, 255, 255, 0.75);
        margin: 0 0 1rem 0;
        line-height: 1.4;
      }
    }

    .bairros-grid {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;

      .bairro-item {
        background-color: rgba(255, 255, 255, 0.05);
        border-left: 3px solid ${colors.elements};
        padding: 0.5rem 0.75rem;
        border-radius: 0 6px 6px 0;
        font-size: 0.88rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
      }
    }

    .consult-block {
      border-color: rgba(255, 190, 24, 0.2);

      .chips-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-bottom: 1.25rem;

        .chip {
          background-color: rgba(255, 255, 255, 0.08);
          padding: 0.3rem 0.65rem;
          border-radius: 20px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.85);
        }
      }

      .whatsapp-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        width: 100%;
        background-color: ${colors.checked || "#009207"};
        color: #ffffff;
        text-decoration: none;
        padding: 0.85rem 1rem;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.95rem;
        box-shadow: 0 4px 12px rgba(0, 146, 7, 0.3);
        transition:
          transform 0.2s ease,
          background-color 0.2s ease;

        .wa-icon {
          font-size: 1.3rem;
        }

        ${hover} {
          &:hover {
            background-color: #00a808;
            transform: translateY(-2px);
          }
        }
      }
    }
  }
`;
