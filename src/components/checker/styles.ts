import { colors } from "@styles/colors";
import styled, { css } from "styled-components";

export const CheckerStyle = styled.div.attrs(
  (props: { checked: boolean }) => props
)`
  .checker {
    width: 25px;
    height: 25px;
    background-color: transparent;
    border-radius: 50%;
    border: 2px solid ${colors.elements};
    display: flex;
    padding: 2px;
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
          background-color: ${colors.elements};
        }
      }
    `}
`;
