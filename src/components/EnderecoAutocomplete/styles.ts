import { colors } from "@styles/colors";
import { sizes } from "@styles/sizes";
import styled from "styled-components";

export const InputAndList = styled.header`
  display: flex;
  flex-direction: column;
  gap: 5px;
  /* flex-grow: 1; */
  height: 100%;
  min-height: 0;

  input {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: none;
  }

  ul {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 5px 0 3px;
    list-style: none;
    min-height: 0;
    overflow-y: auto;

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

export const MapaStyle = styled.div`
  /* flex: 1;
  height: 100%; */

  height: 100%;
  background-color: ${colors.background};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;

  p {
    text-align: center;
  }
`;

// export const EnderecoAutocompleteStyle = styled.div`
//   display: flex;
//   flex-direction: column;
//   padding: 5px;
//   gap: 5px;
//   height: 100%;
// `;
export const EnderecoAutocompleteStyle = styled.div`
  display: grid;
  grid-template-rows: 200px 1fr; //min(300px, 1fr)
  padding: 5px;
  gap: 5px;
  flex: 1;
  /* height: 100% - ${sizes.header}; */
  overflow: hidden;
`;

export const ModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: center;
  color: #fff;
`;
