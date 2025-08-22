import { colors } from "@styles/colors";
import styled from "styled-components";

export const PixViewStyle = styled.main`
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 50px 10px;
  gap: 5px;
  color: #fff;

  .menu {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;

    .valor {
      align-self: center;
    }

    .qrcode-container {
      display: flex;
      flex-direction: column;
      padding: 10px;
      align-self: center;
      gap: 5px;
      .valor {
        color: ${colors.elements};
      }
      .qrcode {
        background-color: #fff;
        padding: 10px;
        border-radius: 10px;
        align-self: center;
        /* transform: scale(0.9); */
        border: 5px solid #000;
        /* transform-origin: top center; */
      }
    }

    .copiacola {
      display: flex;
      flex-direction: column;
      gap: 5px;

      .label {
        font-weight: bold;
      }

      .description {
        font-size: 0.8rem;
        color: #ccc;
      }

      .input-container {
        display: flex;
        align-items: center;
        gap: 5px;
        border: 3px solid #000;
        border-radius: 10px;
        overflow: hidden;
        background-color: #fff;

        * {
          transform: scale(101%);
        }
        input {
          flex: 1;
          padding: 10px;
          border: none;
          background-color: #f9f9f9;
        }

        button {
          background-color: ${colors.elements};
          color: #000;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 3px solid #000;
          &:hover {
            background-color: ${colors.elements};
          }
        }
      }
    }
    input {
      padding: 0.5rem;
      border-radius: 5px;
    }
  }
`;
