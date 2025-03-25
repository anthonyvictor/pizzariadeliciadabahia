import Link from "next/link";
import type { FC, ReactElement } from "react";
import { useCarousel } from "..";
import { CarouselItemStyle } from "./styles";

interface ICarouselItem {
  route: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: { src: string; w: number; h?: number };
  index: number;
  enabled?: boolean;
  children?: ReactElement[];
  onClick?: () => void;
}

const CarouselItem: FC<ICarouselItem> = ({
  route,
  title,
  subtitle,
  description,
  image,
  index,
  enabled,
  children,
  onClick,
}) => {
  const { selectedIndex, length } = useCarousel();

  const _enabled = !!enabled || enabled === undefined;

  const Wrapper = ({ children }) => {
    return _enabled ? (
      <Link
        href={_enabled ? route : "#"}
        prefetch={true}
        onClick={onClick}
        passHref
        key={route}
      >
        {children}
      </Link>
    ) : (
      <>{children}</>
    );
  };

  return (
    <Wrapper>
      <CarouselItemStyle
        className={`${
          selectedIndex === index
            ? " selected"
            : selectedIndex + 1 === index
            ? " next"
            : selectedIndex - 1 === index
            ? " previous"
            : ""
        }${index < selectedIndex - 1 ? " hidden" : ""}`}
        index={index}
        selectedIndex={selectedIndex}
        style={!title ? { padding: 0 } : undefined}
        length={length}
        enabled={_enabled}
        key={route}
      >
        <div className="image-wrapper">
          <img
            src={image.src}
            width={!title ? "100%" : image.w}
            height={image.h ?? image.w}
            alt=""
          />
        </div>
        {!!title && <h3 className="title">{title}</h3>}
        {!!subtitle && <h4 className="subtitle">{subtitle}</h4>}
        {!!description && <p className="tooltip">{description}</p>}
        {children && <div className="bottom-elements">{children}</div>}
      </CarouselItemStyle>
    </Wrapper>
  );
};
export default CarouselItem;
