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
      }
      .dir {
        display: flex;
        flex-direction: column;
        gap: 5px;

        footer {
          display: flex;
          gap: 5px;
        }
      }
    }
  }
`;
