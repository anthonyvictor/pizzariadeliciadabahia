import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import styled from "styled-components";

export const TamanhosViewStyle = styled(LayoutStyle)`
  ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    flex: 1;
    padding: 5px;

    li {
      display: flex;
      align-items: center;
      padding: 10px;
      color: #fff;
      gap: 10px;
      border-radius: 5px;
      background-color: ${colors.backgroundDark};
      .esq {
        .img-container {
          overflow: hidden;
          border-radius: 10px;
          border: 2px solid #fff;
          position: relative;
          width: 60px;
          height: 60px;
        }
      }
      .dir {
        display: flex;
        flex-direction: column;
        gap: 5px;
        .checkers {
          display: flex;
          gap: 10px;
          .checker {
            width: 15px;
            height: 15px;
            border: 1px solid ${colors.elements};
          }
        }
        footer {
          display: flex;
          gap: 5px;
        }
      }
    }
  }
`;
