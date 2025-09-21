import { colors } from "@styles/colors";
import { breakpointsMQ } from "@styles/mediaQueries";
import styled from "styled-components";

export const ConfirmacaoViewStyle = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 50px 20px;
  gap: 5px;

  .menu {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    min-height: 0;

    .itens {
      display: flex;
      flex-direction: column;
      gap: 5px;
      list-style: none;
      min-height: 0;
      overflow-y: auto;
      flex: 1;
    }

    .bottom-info {
      background-color: ${colors.elements};
      display: flex;
      flex-direction: column;
      padding: 10px;
      gap: 5px;
      border-radius: 5px;
      font-size: 0.8rem;
      .info-item {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  @media ${breakpointsMQ.tabletSmUp} {
    width: 500px;
    justify-self: center;
  }
`;
