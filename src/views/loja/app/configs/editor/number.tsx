import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  InputHTMLAttributes,
} from "react";

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "min" | "max" | "step"
> & {
  value: number;
  setValue: (newValue: number) => void;

  min?: number;
  max?: number;

  decimalPlaces?: number;
  step?: number;
  beforeChange?: (newValue: number) => boolean;

  appearance?: "editable" | "visible" | "hiddenOnMin";
  allowVoid?: boolean;

  buttons?: "lr" | "rl" | "hidden";
};

function numToStr(value: number): string {
  return value.toString();
}

function strToNum(value: string): number {
  let str = value.replace(",", ".").replace(/[^0-9.]/g, "");

  if (str.split("").filter((x) => x === ".").length > 1) {
    str = str.replace(/\./, "");
  }

  let num = Number(str);

  const fator = 10 ** 2;
  num = Math.trunc(num * fator) / fator;

  return num;
}

function preciseSum(val1: number, val2: number, decimalPlaces) {
  const factor = 10 ** decimalPlaces;

  const somaInteiros = val1 * factor + val2 * factor;

  return somaInteiros / factor;
}

export type NumberInputRef = {
  focus: () => void;
  getValue: () => number;
};

function preciseSubtract(val1, val2, decimalPlaces) {
  const factor = 10 ** decimalPlaces;

  let resultadoInteiro = Math.round(val1 * factor);

  resultadoInteiro -= Math.round(val2 * factor);

  return resultadoInteiro / factor;
}

function checkDecimalPlaces(value: string, decimalPlaces: number): boolean {
  // Normaliza vírgula para ponto
  const normalized = value.replace(",", ".");

  if (normalized.includes(".") && !decimalPlaces) return false;

  // Se não tiver ponto decimal, ok
  if (!normalized.includes(".")) return true;

  // Pega a parte depois do ponto
  const decimals = normalized.split(".")[1] ?? "";

  return decimals.length <= decimalPlaces;
}

export const NumberInput = forwardRef<NumberInputRef, NumberInputProps>(
  (
    {
      value,
      setValue,
      onBlur,
      disabled,
      decimalPlaces = 0,
      step = 1,
      appearance = "hiddenOnMin",
      max = 10000000000000,
      min = 0,
      beforeChange = () => true,
      allowVoid = true,
      buttons = "lr",
      style = {},
      className,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [strValue, setStrValue] = useState<string>(() => numToStr(value));
    const [upDisabled, setUpDisabled] = useState(false);
    const [downDisabled, setDownDisabled] = useState(false);
    // const [isFocused, setIsFocused] = useState(false);

    const allowChange = (newValue: number) =>
      newValue <= max && newValue >= min && beforeChange(newValue);

    useEffect(() => {
      console.log("mudou val, novo strVal:", numToStr(value), "value:", value);
      setStrValue(numToStr(value));
    }, [value]);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      getValue: () => strToNum(strValue),
    }));

    //    useEffect(() => {
    //   if (!isFocused) {
    //     setStrValue(f(value));
    //   }
    // }, [value,  isFocused]); //decimalPlaces,

    const ensuredValue = value ? value : 0;

    useEffect(() => {
      (() => {
        // const novoNum = preciseSum(ensuredValue, step, decimalPlaces);
        // setUpDisabled(!allowChange(novoNum));
        setUpDisabled(ensuredValue === max);
      })();
      (() => {
        // const novoNum = ensuredValue - step;
        // setDownDisabled(!allowChange(novoNum));
        setDownDisabled(ensuredValue === min);
      })();
    }, [value]);

    const f = (v: number) =>
      decimalPlaces ? v.toFixed(decimalPlaces) : v.toString();

    const Bt = ({ t }: { t: "+" | "-" }) => {
      const add = () => {
        const newVal = preciseSum(ensuredValue, step, decimalPlaces);
        return newVal <= max ? newVal : max;
      };

      const sub = () => {
        const newVal = preciseSubtract(ensuredValue, step, decimalPlaces);
        return newVal >= min ? newVal : min;
      };

      return (
        <button
          type={"button"}
          tabIndex={appearance === "editable" ? -1 : undefined}
          style={
            t === "-"
              ? {
                  visibility:
                    appearance !== "hiddenOnMin"
                      ? "initial"
                      : (value ?? min) > min
                      ? "initial"
                      : "hidden",
                }
              : undefined
          }
          disabled={disabled || (t === "+" ? upDisabled : downDisabled)}
          onClick={(e) => {
            e.stopPropagation();

            const novoNum = t === "+" ? add() : sub();

            console.log("novoNum", novoNum, value, step);
            console.log("novoNum ++", value + step);

            if (!allowChange(novoNum)) return;

            setStrValue(f(novoNum));
            setValue(novoNum);

            //  const novoNum = strToNum(e.target.value);
            // if (novoNum !== value && !allowChange(novoNum))
            //   return e.preventDefault();

            // setStrValue(e.target.value);
            // setValue(novoNum);
          }}
        >
          {t}
        </button>
      );
    };

    return (
      <div style={style} className={className}>
        {buttons !== "hidden" && <Bt t={buttons === "lr" ? "-" : "+"} />}
        <input
          {...rest}
          ref={inputRef}
          type={"number"}
          value={strValue}
          step={step}
          disabled={disabled || appearance !== "editable"}
          style={{
            visibility:
              appearance !== "hiddenOnMin"
                ? "initial"
                : (value ?? min) > min
                ? "initial"
                : "hidden",
          }}
          // onFocus={() => setIsFocused(true)}
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
              "ControlKey",
              "AltKey",
            ];
            console.log("val:", e.currentTarget.value, "strValue:", strValue);
            if (min < 0 && !e.currentTarget.value.includes("-")) {
              allowedKeys.push("-");
            }

            if (decimalPlaces) allowedKeys.push(".", ",");

            if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key))
              e.preventDefault();
          }}
          onChange={(e) => {
            if (!checkDecimalPlaces(e.target.value, decimalPlaces))
              return e.preventDefault();
            const novoNum = strToNum(e.target.value);
            console.log("novoNum", novoNum);
            console.log("value", value);
            if (novoNum !== value && !allowChange(novoNum))
              return e.preventDefault();

            setStrValue(e.target.value);
            setValue(novoNum);
          }}
          onBlur={() => {
            if (!allowVoid) {
              if (value === 0 && strValue.trim() === "") {
                setStrValue("0");
              }
            }
          }}
        />
        {buttons !== "hidden" && <Bt t={buttons === "lr" ? "+" : "-"} />}
      </div>
    );
  }
);
