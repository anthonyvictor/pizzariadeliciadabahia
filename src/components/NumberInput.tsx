import { colors } from "@styles/colors";
import { HTMLProps, useEffect, useState } from "react";
import styled from "styled-components";

interface INumberInput {
  value: number;
  setValue: (newValue: number) => void;
  max?: number;
  min?: number;
  decimalPlaces?: number;
  beforeUp?: (newValue: number) => boolean;
  beforeDown?: (newValue: number) => boolean;
  forceMin?: boolean;
  editable?: boolean;
  style?: HTMLProps<HTMLDivElement>["style"];
}

export const NumberInput = ({
  value: numValue,
  setValue: setNumValue,
  decimalPlaces = 0,
  editable = false,
  max = 10000000000000,
  min = 0,
  beforeUp = () => true,
  beforeDown = () => true,
  forceMin = false,
  style,
}: INumberInput) => {
  const [strValue, setStrValue] = useState(numValue.toString());

  const f = (v: number) =>
    decimalPlaces ? v.toFixed(decimalPlaces) : v.toString();

  const canUp = (novoNum: number) =>
    novoNum <= max && novoNum >= min && beforeUp(novoNum);

  const canDown = (novoNum: number) =>
    novoNum <= max && novoNum >= min && beforeDown(novoNum);

  const [upDisabled, setUpDisabled] = useState(false);
  const [downDisabled, setDownDisabled] = useState(false);

  useEffect(() => {
    (() => {
      const novoNum = numValue + 1;
      setUpDisabled(!canUp(novoNum));
    })();
    (() => {
      const novoNum = numValue - 1;
      setDownDisabled(!canDown(novoNum));
    })();
  }, [numValue]);

  return (
    <NumberInputStyle style={style}>
      <button
        disabled={downDisabled}
        style={{
          visibility: editable
            ? "initial"
            : numValue > 0
            ? "initial"
            : "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();

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
      <input
        type={"text"}
        style={{
          visibility: editable
            ? "initial"
            : numValue > 0
            ? "initial"
            : "hidden",
        }}
        disabled={!editable}
        onKeyDown={(e) => {
          const allowedKeys = [
            "Backspace",
            "Tab",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Enter",
          ];

          // se não for número e não estiver na lista de permitidos → bloqueia
          if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
          }

          // if (
          //   ![
          //     ..."0123456789,".split(""),
          //     "ControlKey",
          //     "AltKey",
          //     "Backspace",
          //   ].includes(e.key)
          // ) {
          //   e.preventDefault();
          // }
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

      <button
        style={{ color: colors.elements }}
        disabled={upDisabled}
        onClick={(e) => {
          e.stopPropagation();

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
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
  min-width: 90px;
  flex: 0;
  input {
    font-size: 1rem;
    border: none;
    color: #fff;
    background-color: transparent;
    text-align: center;
    min-width: 0;
    /* flex-grow: 0;
    flex-shrink: 1; */
    flex: 1;

    height: 100%;
  }

  button {
    background-color: #00000010;
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
    min-width: 0;
    padding: 5px;

    &:disabled {
      opacity: 0.5;
    }
  }
`;
