import { colors } from "@styles/colors";
import styled from "styled-components";

export const MyButtonStyle = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: ${colors.backgroundDark}90;
  border: none;
  border-radius: 10px;
  color: #fff;

  .icone {
    background-color: ${colors.backgroundDark};
    padding: 7px;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      font-size: 2rem;
    }
  }

  span {
    font-size: 1.5rem;
  }
`;
