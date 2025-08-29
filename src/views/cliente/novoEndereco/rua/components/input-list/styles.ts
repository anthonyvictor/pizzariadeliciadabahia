import { colors } from "@styles/colors";
import styled from "styled-components";

export const InputAndListStyle = styled.div.attrs(
  (props: { expand: boolean }) => props
)`
  display: flex;
  flex-direction: column;
  gap: 5px;
  /* flex-grow: 1; */
  min-height: 0;

  /* height: 100%; */

  input {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: none;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-grow: 1;
    padding: 0 5px 0 3px;
    list-style: none;
    min-height: 400px;

    .carregando {
      color: #fff;
    }

    .sugestao {
      padding: 15px 10px;
      border-radius: 2px;
      background-color: ${colors.backgroundDark};
      color: #fff;

      &.clicked {
        background-color: ${colors.elements};
        color: #000;
      }
    }
  }
`;
