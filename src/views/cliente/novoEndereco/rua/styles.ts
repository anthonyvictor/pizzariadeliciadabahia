import styled from "styled-components";

export const RuaViewStyle = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  display: grid;
  grid-template-rows: 1fr 70% 1fr; //min(300px, 1fr)
  overflow-y: auto;
  padding: 5px;
  gap: 5px;
  flex: 1;
`;
