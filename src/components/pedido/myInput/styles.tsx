import styled from "styled-components";
import { colors } from "@styles/colors";

export const MyInputStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;

  .input-label {
    display: flex;
    flex-direction: column;
    padding: 5px 0;
    gap: 5px;
    min-width: 0;
  }

  label {
    font-size: 1rem;
    color: #fff;
  }

  small {
    font-size: 0.7rem;
    color: #fff;
  }
  input,
  textarea,
  select {
    text-transform: uppercase;
    font-size: 1.1rem;
    padding: 0.3rem;
    border: none;
    border-radius: 5px;
    line-height: 100%;

    &::placeholder {
      font-size: min(1rem, 3vw);
      color: #00000095;
    }
  }

  input[type="checkbox"] {
    accent-color: ${colors.checked};
  }
`;
