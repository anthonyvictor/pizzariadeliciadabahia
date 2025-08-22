import { Title, Subtitle, Description } from "@components/text/styles";
import type { FC, ReactElement } from "react";
import { TextContainerStyle } from "./styles";

interface TextContainerProps {
  title?: string;
  titleColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  description?: string;
  descriptionColor?: string;
}

const TextContainer: FC<TextContainerProps> = ({
  title,
  titleColor,
  subtitle,
  subtitleColor,
  description,
  descriptionColor,
}) => {
  if (!title && !subtitle && !description) return <></>;
  return (
    <TextContainerStyle>
      {title && <Title style={{ color: titleColor }}>{title}</Title>}
      {subtitle && (
        <Subtitle style={{ color: subtitleColor }}>{subtitle}</Subtitle>
      )}
      {description && (
        <Description style={{ color: descriptionColor }}>
          {description}
        </Description>
      )}
    </TextContainerStyle>
  );
};
export default TextContainer;
