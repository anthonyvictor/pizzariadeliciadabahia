import { SetState } from "@config/react";
import { colors } from "@styles/colors";
import { useState } from "react";
import styled from "styled-components";

export const NumberInput = ({
  value: numValue,
  setValue: setNumValue,
  decimalPlaces = 0,
  max = 10000000000000,
  min = 0,
  beforeUp = () => true,
  beforeDown = () => true,
  forceMin = false,
}: {
  value: number;
  setValue: (newValue: number) => void;
  max?: number;
  min?: number;
  decimalPlaces?: number;
  beforeUp?: (newValue: number) => boolean;
  beforeDown?: (newValue: number) => boolean;
  forceMin?: boolean;
}) => {
  const f = (v: number) =>
    decimalPlaces ? v.toFixed(decimalPlaces) : v.toString();
  const [strValue, setStrValue] = useState(numValue.toString());
  const canUp = (novoNum: number) =>
    novoNum <= max && novoNum >= min && beforeUp(novoNum);
  const canDown = (novoNum: number) =>
    novoNum <= max && novoNum >= min && beforeDown(novoNum);
  return (
    <NumberInputStyle>
      <button
        style={{ visibility: numValue > 0 ? "initial" : "hidden" }}
        onClick={() => {
          const novoNum =
            numValue - 1 >= (forceMin ? min : 0)
              ? numValue - 1
              : forceMin
              ? min
              : 0;
          if (!canDown(novoNum)) return;
          setNumValue(novoNum);
          setStrValue(f(novoNum));
        }}
      >
        -
      </button>

      <div style={{ visibility: numValue > 0 ? "initial" : "hidden" }}>
        <input
          type={"text"}
          disabled
          onKeyDown={(e) => {
            if (
              ![
                ..."0123456789,".split(""),
                "ControlKey",
                "AltKey",
                "Backspace",
              ].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          value={strValue}
          onChange={(e) => {
            const novoNum = Number(
              e.target.value.replace(".", "").replace(",", ".")
            );
            if (
              (novoNum > numValue && !canUp(novoNum)) ||
              (novoNum < numValue && !canDown(novoNum))
            ) {
              e.preventDefault();
            } else {
              setStrValue(e.target.value);
              setNumValue(novoNum);
            }
          }}
        />
      </div>

      <button
        style={{ color: colors.elements }}
        onClick={() => {
          const novoNum = numValue + 1 <= max ? numValue + 1 : numValue;

          if (!canUp(novoNum)) return;
          setNumValue(novoNum);
          setStrValue(f(novoNum));
        }}
      >
        +
      </button>
    </NumberInputStyle>
  );
};

const NumberInputStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  min-width: 0;
  flex-shrink: 1;

  input {
    /* max-width: 50px; */
    font-size: 1rem;
    padding: 5px 10px;
    background-color: #00000010;
    background-color: transparent;
    border: none;
    color: #fff;
    text-align: center;
    min-width: 0;
    flex-basis: 50px;
    max-width: 50px;
  }
  button {
    background-color: #00000010;
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    font-weight: 800;
    padding: 5px 10px;
    color: #fff;
    min-width: 0;
  }
`;
