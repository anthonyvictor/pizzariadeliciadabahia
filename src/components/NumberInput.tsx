import { colors } from "@styles/colors";
import { hover } from "@styles/mediaQueries";
import { HTMLProps, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

export interface INumberInput {
  value: number;
  setValue: (newValue: number) => void;
  max?: number;
  min?: number;
  decimalPlaces?: number;
  beforeUp?: (newValue: number) => boolean;
  beforeDown?: (newValue: number) => boolean;
  onChange?: () => void;
  forceMin?: boolean;
  editable?: boolean;
  style?: HTMLProps<HTMLDivElement>["style"];
  disabled?: boolean;
  allowVoid?: boolean;
  display?: "horizontal" | "vertical";
  className?: string;
  showZero?: boolean;
  alwaysShowMinus?: boolean;
}

export const NumberInput = ({
  value: numValue,
  setValue: setNumValue,
  className = "",
  disabled = false,
  decimalPlaces = 0,
  showZero = false,
  editable = false,
  max = 10000000000000,
  min = 0,
  beforeUp = () => true,
  beforeDown = () => true,
  onChange = () => {},
  forceMin = false,
  allowVoid = true,
  style,
  display = "horizontal",
  alwaysShowMinus = false,
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

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setStrValue(f(numValue));
    }
  }, [numValue, decimalPlaces, isFocused]);

  useEffect(() => {
    (() => {
      const novoNum = (numValue ?? 0) + 1;
      setUpDisabled(!canUp(novoNum));
    })();
    (() => {
      const novoNum = (numValue ?? 0) - 1;
      setDownDisabled(!canDown(novoNum));
    })();
  }, [numValue]);

  return (
    <NumberInputStyle style={style} display={display} className={className}>
      <button
        disabled={disabled || downDisabled}
        tabIndex={editable ? -1 : undefined}
        type={"button"}
        style={{
          visibility:
            editable || alwaysShowMinus
              ? "initial"
              : (numValue ?? 0) > min
              ? "initial"
              : "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();

          const novoNum =
            (numValue ?? 0) - 1 >= (forceMin ? min : 0)
              ? (numValue ?? 0) - 1
              : forceMin
              ? min
              : 0;
          if (!canDown(novoNum)) return;
          setNumValue(novoNum);
          setStrValue(f(novoNum));
          onChange();
        }}
      >
        -
      </button>
      <input
        type={"number"}
        style={{
          visibility: editable
            ? "initial"
            : numValue > 0 || showZero
            ? "initial"
            : "hidden",
        }}
        disabled={disabled || !editable}
        onFocus={() => setIsFocused(true)}
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
          let str = e.target.value
            // .replace(".", ",")
            .replace(",", ".")
            .replace(/[^0-9\.]/g, "");

          if (str.split("").filter((x) => x === ".").length > 1) {
            str = str.replace(/\./, "");
          }

          const novoNum = Number(str);
          if (
            (novoNum > numValue && !canUp(novoNum)) ||
            (novoNum < numValue && !canDown(novoNum))
          ) {
            e.preventDefault();
          } else {
            setStrValue(e.target.value);
            setNumValue(novoNum);
            onChange();
          }
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (!allowVoid) {
            if (numValue === 0 && strValue.trim() === "") {
              setStrValue("0");
            }
          }
        }}

        //  onBlur={() => {
        //   setStrValue(f(numValue)); // força ajuste final
        // }}
      />
      <button
        type={"button"}
        tabIndex={editable ? -1 : undefined}
        disabled={disabled || upDisabled}
        onClick={(e) => {
          e.stopPropagation();

          const novoNum =
            (numValue ?? 0) + 1 <= max ? (numValue ?? 0) + 1 : numValue ?? 0;

          if (!canUp(novoNum)) return;
          setNumValue(novoNum);
          setStrValue(f(novoNum));
          onChange();
        }}
      >
        +
      </button>
    </NumberInputStyle>
  );
};

export const NumberInputStyle = styled.div.attrs(
  (props: { display: "horizontal" | "vertical" }) => props
)`
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  min-width: 90px;

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
    &:disabled {
      opacity: 0.5;
    }
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

    &:nth-of-type(2) {
      color: ${colors.elements};
    }
  }

  ${(props) =>
    props.display === "vertical" &&
    css`
      display: flex;
      flex-direction: column-reverse;
      min-width: 40px;
      background-color: ${colors.backgroundDark};
      input {
        width: 40px;
        font-size: 0.8rem;
        padding: 2px;
      }

      button {
        width: 100%;
        font-size: 0.8rem;
        padding: 6px 0;
        cursor: pointer;
        background-color: #00000010;
        ${hover} {
          &:hover {
          }
        }
      }
    `}
`;
