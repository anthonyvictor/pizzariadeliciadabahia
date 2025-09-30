import { MyInputStyle } from "@components/pedido/myInput/styles";
import { HTMLProps } from "react";
import styled from "styled-components";

export const Search = ({
  setValue,
  ...props
}: HTMLProps<HTMLInputElement> & { setValue: (val: string) => void }) => {
  return (
    <Style>
      <input
        {...props}
        autoFocus
        type={"search"}
        onChange={(e) => setValue(e.target.value)}
      />
    </Style>
  );
};

const Style = styled(MyInputStyle)`
  padding: 5px;
`;
