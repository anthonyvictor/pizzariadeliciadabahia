import { colors } from "@styles/colors";
import styled from "styled-components";

export const MetodoStyle = styled.li`
  background-color: ${colors.backgroundDark}60;
  border-bottom: 2px solid ${colors.backgroundDark};
  color: #fff;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .left {
      display: flex;
      flex-direction: column;
      /* align-items: center; */
      gap: 5px;
      .icone-nome {
        display: flex;
        align-items: center;
        gap: 10px;
        .icone {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-radius: 10px;
          border: 2px solid #000;
        }
      }
      .cupom {
        font-weight: 500;
        color: ${colors.elements};
        display: flex;
        align-items: center;
        gap: 5px;

        .cupom-nome {
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          gap: 2px;
          strong {
            font-size: 1rem;
            font-weight: 800;
          }
        }
        .cupom-icone {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
      }
    }

    .item-price {
      display: flex;
      flex-direction: column;
      font-size: 1.2rem;
      align-items: end;
      .price {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: center;

        .price-title {
          font-size: 0.7rem;
        }
      }
      .original-price {
        font-size: 0.9rem;
      }
      .change {
        font-size: 0.7rem;
        opacity: 0.8;
      }
      .free-price {
        color: ${colors.checkedLight};
      }
    }

    .pagamentos {
      list-style: none;
      text-align: right;

      .pagamento {
        display: flex;
        flex-direction: column;
        .descricao {
          font-size: 0.6rem;
        }
      }
    }
  }

  .troco-container {
    display: flex;
    flex-direction: column;

    & > section {
      display: flex;
      align-items: center;
      justify-content: stretch;
      gap: 10px;
    }

    .precisa-troco {
    }

    .troco {
      flex: 1;
    }
  }
`;
