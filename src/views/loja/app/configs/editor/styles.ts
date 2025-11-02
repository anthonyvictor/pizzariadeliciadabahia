import { LayoutStyle } from "@components/layout/styles";
import { colors } from "@styles/colors";
import styled from "styled-components";

export const ConfigViewStyle = styled(LayoutStyle)`
  padding: 10px;
  overflow-y: auto;

  .numberbuttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button,
    input {
      padding: 5px 10px;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0; /* Remove margem que pode ser adicionada em alguns navegadores */
    }

    /* Para Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  }

  .nome-descricao-section {
    flex-shrink: 1;
    min-width: 0;

    /* display: flex;
    align-items: center;
    flex-shrink: 0; */
  }

  .info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3px;
  }
  .valores {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .badges {
    display: flex;
    gap: 10px;
    list-style: none;
    overflow-x: auto;

    .badge {
      padding: 5px 10px;
      border-radius: 10px;
      background-color: ${colors.elements};
    }
  }
`;

export const ValorStyle = styled.div`
  display: flex;
  padding: 7px 5px;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background-color: ${colors.backgroundDark};
  border-radius: 5px;
`;
