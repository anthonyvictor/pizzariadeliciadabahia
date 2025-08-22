import { colors } from "@styles/colors";
import styled, { css } from "styled-components";

export const CheckerStyle = styled.div.attrs(
  (props: { checked: boolean }) => props
)`
  .checker {
    width: 30px;
    height: 30px;
    background-color: transparent;
    border-radius: 50%;
    border: 2px solid ${colors.background};
    display: flex;
    padding: 1px;
    span {
      border-radius: 50%;
      flex: 1;
    }
  }

  ${(props) =>
    props.checked &&
    css`
      .checker {
        span {
          background-color: ${colors.checkedLight};
        }
      }
    `}
`;
