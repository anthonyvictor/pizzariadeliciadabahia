import { colors } from "@styles/colors";
import styled from "styled-components";

export const GroupStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .group {
    display: flex;
    align-items: center;
    color: ${colors.elements};
    padding: 5px;
    gap: 5px;
    font-size: 0.8rem;
  }
`;

export const ChecklistSearchStyle = styled.div`
  button {
    background-color: transparent;
    color: #fff;
    padding: 0 10px;
    border: none;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-close {
    display: flex;
    align-items: center;
    background-color: ${colors.backgroundDark};
    position: absolute;
    inset: 0;
    padding: 10px;

    input {
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #fff;
      flex: 1;
      color: #fff;
      &::placeholder {
        color: #ddd;
        font-style: italic;
        opacity: 1; /* Safari precisa disso */
      }
    }
  }
`;
export const ChecklistHeaderStyle = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  color: #fff;
  background-color: ${colors.backgroundDark};
  display: flex;
  align-items: stretch;
  justify-content: stretch;

  .relative-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    position: relative;
    flex: 1;
    .badge-search {
      display: flex;
      align-items: center;
      gap: 10px;
      .badge {
        font-weight: 800;
        border-radius: 10px;
        padding: 6px;
        font-size: 0.6rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .status {
        }
        .len {
          font-size: 0.5rem;
        }
      }
    }
  }
`;
// background-color: ${({ checked }) =>
//         checked ? colors.checkedLight : `#000`};
//       color: ${({ checked }) => (checked ? `#000` : `#fff`)};
export const ChecklistItemInfoStyle = styled.aside`
  display: flex;
  flex-direction: column;
  flex: 1;
  .title {
  }

  .old-price {
    font-size: 0.6rem;
    text-decoration: line-through;
    opacity: 0.6;
  }
`;

export const ChecklistStyle = styled.section.attrs(
  (props: { checked: boolean }) => props
)`
  & > ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    min-height: 55px;

    gap: 5px;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px;
      border: none;
      border-bottom: 1px solid ${colors.backgroundDark}70;
      color: #fff;
      background-color: ${colors.backgroundDark}40;
      min-width: 0;
      gap: 5px;

      .img {
        height: 50px;
        position: relative;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid ${colors.backgroundDark};
        overflow: hidden;

        img {
          display: none;
          background-color: #fff;
          border-radius: 10px;
          transform: scale(101%);
        }
      }
    }
  }
  .show-more {
    padding: 20px 10px;
    background-color: transparent;
    color: ${colors.elements};
    border: none;
    width: 100%;
    font-weight: 800;
  }
`;
