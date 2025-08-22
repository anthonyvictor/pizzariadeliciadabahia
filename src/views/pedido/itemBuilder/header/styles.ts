import { colors } from "@styles/colors";
import { shapes } from "@styles/shapes";
import styled from "styled-components";

export const ItemBuilderHeaderStyle = styled.header`
  display: flex;
  flex-direction: column;
  color: #fff;
  align-items: center;

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transform: translateY(-30px);
    padding: 0 5px;
  }

  .capa {
    width: 100%;
    height: auto;
    aspect-ratio: 4/3;
    /* background-repeat: repeat; */
    background-size: cover;
    background-position: center;
  }

  .titulo {
  }

  .prod-img {
    position: relative;
    background-color: #fff;
    /* border-radius: 10px; */
    width: 100%;
    height: auto;
    aspect-ratio: 4/3;
    display: flex;
    align-self: center;
    overflow: hidden;

    img {
      display: none;
      background-color: #fff;
    }

    .bottom-shape {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100px;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      transform: translateY(50%);
      overflow: hidden;
      display: flex;
      .shape {
        background-color: ${colors.background};
        flex: 1;
      }
    }
  }
`;

// export const ItemBuilderHeaderStyle = styled.header`
//   display: flex;
//   gap: 5px;
//   color: #fff;
//   padding: 10px;
//   align-items: center;
//   .info {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//   }

//   .capa {
//     width: 100%;
//     height: 150px;
//     background-repeat: repeat;
//     background-size: contain;
//     background-position: center;
//   }

//   .titulo {
//   }

//   .prod-img {
//     position: relative;
//     background-color: #fff;
//     border-radius: 10px;
//     width: 120px;
//     height: 120px;
//     display: flex;
//     align-self: center;

//     img {
//       display: none;
//       background-color: #fff;
//       border-radius: 10px;
//     }
//   }
// `;
