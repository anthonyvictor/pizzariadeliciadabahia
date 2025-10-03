import { MyInputStyle } from "@components/pedido/myInput/styles";
import { useAutoFocus } from "@util/hooks/autoFocus";
import { HTMLProps, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const Search = ({
  setValue,
  ...props
}: HTMLProps<HTMLInputElement> & { setValue: (val: string) => void }) => {
  const { inputRef } = useAutoFocus();

  return (
    <Style>
      <input
        {...props}
        ref={inputRef}
        type={"search"}
        onChange={(e) => setValue(e.target.value)}
      />
    </Style>
  );
};

const Style = styled(MyInputStyle)`
  padding: 5px;
`;
