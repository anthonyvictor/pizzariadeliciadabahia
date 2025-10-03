import { colors } from "@styles/colors";
import styled, { css } from "styled-components";

export const CheckerStyle = styled.div.attrs(
  (props: { checked: boolean }) => props
)`
  display: flex;
  align-items: center;
  gap: 5px;

  .checker {
    width: 25px;
    height: 25px;
    background-color: transparent;
    border-radius: 50%;
    border: 2px solid ${colors.elements};
    display: flex;
    /* padding: 2px; */

    span {
      border-radius: 50%;
      flex: 1;
      transform: scale(75%);
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
