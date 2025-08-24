import styled from "styled-components";

export const TabStyle = styled.button`
  padding: 10px;
  background-color: transparent;
  border: none;
  color: #fff;
  flex: 1;
  font-size: 0.6rem;
  &:not(:last-child) {
    border-right: 2px solid #fff;
  }
`;
