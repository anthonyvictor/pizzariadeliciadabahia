import { breakpointsMQ } from "@styles/mediaQueries";
import { ReactNode } from "react";
import styled from "styled-components";

export const Lista = ({
  children,
  name,
}: {
  name: string;
  children: ReactNode | ReactNode[];
}) => {
  return <Style className={`${name} no-scroll`}>{children}</Style>;
};

const Style = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 0;
  flex: 1;
  padding: 5px;

  @media ${breakpointsMQ.tabletSmUp} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: start;
    align-items: start;
    align-content: start;
  }
  @media ${breakpointsMQ.desktopSmUp} {
    grid-template-columns: repeat(3, 1fr);
  }
  @media ${breakpointsMQ.desktopMdUp} {
    grid-template-columns: repeat(4, 1fr);
  }
  @media ${breakpointsMQ.desktopLgUp} {
    grid-template-columns: repeat(5, 1fr);
  }
`;
