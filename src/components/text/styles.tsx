import { colors } from "@styles/colors";
import styled from "styled-components";

interface Props {
  color?: "primary" | "secondary" | string;
}

export const Title = styled.h1.attrs((props: Props) => props)`
  color: ${(props) =>
    props.color === "primary"
      ? colors.elements
      : props.color === "secondary"
        ? "#fff"
        : props.color || colors.elements};
  font-size: clamp(1rem, 1.2rem, 4vw);
`;

export const Subtitle = styled.h3.attrs((props: Props) => props)`
  color: ${(props) =>
    props.color === "primary"
      ? colors.elements
      : props.color === "secondary"
        ? "#fff"
        : props.color || "#fff"};
  font-size: clamp(0.7rem, 0.9rem, 4vw);
`;

export const Description = styled.p.attrs((props: Props) => props)`
  color: ${(props) =>
    props.color === "primary"
      ? colors.elements
      : props.color === "secondary"
        ? "#fff"
        : props.color || "#fff"};
  font-size: clamp(0.5rem, 0.7rem, 3vw);
`;
