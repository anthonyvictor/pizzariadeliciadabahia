import { IBebida, ILanche, ICombo, IPizzaTamanho } from "tpdb-lib";
import { colors } from "@styles/colors";
import styled, { css } from "styled-components";
import { breakpointsMQ } from "@styles/mediaQueries";

export const PedidoStyle = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 5px;
  padding: 10px 0 50px 0;
  position: relative;

  @media ${breakpointsMQ.desktopSmUp} {
    width: 500px;
    justify-self: center;
  }

  .menu {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 10px;
    min-height: 0;

    .uls {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
    }

    .cupom {
      align-self: center;
      color: #fff;
      a {
        color: ${colors.elements};
        font-weight: 800;
      }
    }
  }
`;
