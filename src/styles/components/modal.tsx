import { colors } from "@styles/colors";
import { ButtonHTMLAttributes, HTMLProps } from "react";
import { CgClose } from "react-icons/cg";
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #00000099;
  inset: 0;
  z-index: 999;
  backdrop-filter: blur(5px);
  padding: 20px;
`;
export const ModalContainer = styled.div`
  background-color: ${colors.background};
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  /* max-width: 90vw; */
  position: relative;
`;

export const ModalCloseButton = ({
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <ModalCloseButtonStyle onClick={onClick} {...props}>
      <CgClose />
    </ModalCloseButtonStyle>
  );
};

export const ModalCloseButtonStyle = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: ${colors.background};
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
`;
