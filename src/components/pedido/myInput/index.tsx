import {
  FocusEvent,
  forwardRef,
  HTMLProps,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { MyInputStyle } from "./styles";
import CurrencyInput from "react-currency-input-field";
import "react-phone-number-input/style.css";

type IMyInput = {
  className?: HTMLProps<HTMLInputElement>["className"];
  disabled?: boolean;
  name: string;
  description?: string;
  id?: string;
  placeholder?: string;
  type:
    | "text"
    | "email"
    | "name"
    | "address"
    | "phoneNumber"
    | "zipCode"
    | "number"
    | "currency"
    | "checkbox"
    | "password"
    | "date";
  value?: string | number;
  checked?: boolean;
  tabIndex?: number;
  setValue?: (value: string | number) => void;
  setChecked?: (value: boolean) => void;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  tag?: string;
  autoFocus?: boolean;
  onFocus?: (e: Event) => void;
  onClick?: (e: Event) => void;
  onKeyDown?: (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBeforeInput?: (
    e: React.FormEvent<HTMLInputElement> & { data: string }
  ) => void;
  onDrop?: (e: React.DragEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};

export const MyInput = forwardRef<HTMLDivElement, IMyInput>(
  (
    {
      className = "",
      disabled = false,
      description,
      id = "",
      name,
      type,
      placeholder,
      tabIndex,
      value,
      checked,
      min,
      max,
      minLength,
      maxLength,
      setValue,
      setChecked,
      onClick,
      onFocus,
      onBlur,
      onKeyUp,
      onKeyDown: _onKeyDown,
      onBeforeInput,
      onDrop,
      onPaste,
      tag,
      autoFocus = false,
    },
    ref
  ) => {
    const inputPropsText = {
      value: value || "",
      onChange: (e) => setValue(e.target.value),
      onClick: (e) => onClick?.(e),
      onFocus: (e) => onFocus?.(e),
      onBeforeInput: (e) => onBeforeInput?.(e),
      onDrop: (e) => onDrop?.(e),
      onPaste: (e) => onPaste?.(e),
      placeholder: placeholder,
      autoCorrect: "off",
      spellCheck: false,
      min: min ?? undefined,
      maxLength: maxLength ?? undefined,
      minLength: minLength ?? undefined,
      max: max ?? undefined,
      step: type === "number" ? 0.5 : undefined,
      onBlur,
      onKeyUp,
      onKeyDown: (e) => {
        if (
          [..."+-.".split("")].some(
            (x) => e.key.toUpperCase() === x && type === "number"
          )
        )
          return e.preventDefault();
        const onlyNumbers = e.key.match(/[^\d\+\-)(\s]/g);
        const arrows = e.key.match(/(ArrowLeft|ArrowUp|ArrowDown|ArrowRight)/g);
        const cutOrCopy = (e.key === "c" || e.key === "v") && e.ctrlKey;
        if (
          ["phoneNumber", "zipCode"].includes(type) &&
          onlyNumbers &&
          !cutOrCopy &&
          !arrows &&
          !["Backspace", "Delete", "Tab"].includes(e.key)
        )
          e.preventDefault();
        _onKeyDown?.(e);
      },
    };
    const inputPropsCheck = {
      checked,
      onChange: (e) => setChecked(e.target.checked),
    };
    const inputProps = {
      name: id ?? name,
      id: (id || name).replace(/[* ]/g, ""),
      disabled: disabled,
      autoFocus: autoFocus,
      tabIndex: tabIndex,
      type:
        type === "zipCode"
          ? "tel"
          : // : type === "phoneNumber"
          // ? "tel"
          type === "address"
          ? "search"
          : type === "name"
          ? "text"
          : type,
      "data-mask": type === "zipCode" ? "00.000-000" : undefined,

      ...(type === "checkbox" ? inputPropsCheck : inputPropsText),
    };

    // data-mask: type === 'phoneNumber' ? "(00) 90000-0000" : undefined}
    // autoComplete:
    //   localStorage.getItem("dev")
    //     ? "off"
    //     : type === "address"
    //     ? "street-address"
    //     : // : type === "phoneNumber"
    //     // ? "tel-national"
    //     type === "zipCode"
    //     ? "postal-code"
    //     : // : type === "name"
    //       // ? "given-name"
    //       // : undefined
    //       "off"
    // }

    const [PhoneInput, setPhoneInput] = useState<any>(null);

    useEffect(() => {
      import("react-phone-number-input").then((mod) => {
        setPhoneInput(() => mod.default);
      });
    }, []);

    if (!PhoneInput) return <></>;

    return (
      <MyInputStyle
        id={`myInput-${name}`}
        className={`myInput ${className}`}
        ref={ref}
      >
        <div
          className="input-label"
          style={{ flexDirection: type === "checkbox" ? "row" : "column" }}
        >
          <label htmlFor={name}>{name}</label>
          {type === "phoneNumber" ? (
            <PhoneInput
              placeholder="(71) 9xxxx-xxxx"
              defaultCountry="BR"
              limitMaxLength={true}
              countryCallingCodeEditable={false}
              international={false}
              countrySelectProps={{ tabIndex: -1 }}
              value={(value as string | undefined) || ""}
              onChange={(value) => {
                setValue(value);
              }}
              onBlur={onBlur}
            />
          ) : type === "currency" ? (
            <CurrencyInput
              // {...inputProps}
              prefix="R$ "
              intlConfig={{ locale: "pt-BR", currency: "BRL" }}
              value={value}
              allowNegativeValue={false}
              allowDecimals={true}
              decimalsLimit={2}
              maxLength={10}
              aria-valuemax={10}
              onValueChange={(value, name, values) => {
                if (!values.float) return setValue("");

                if (max && values.float > max) {
                  setValue(`${max}`);
                } else if (min && values.float < min) {
                  setValue(`${min}`);
                } else {
                  setValue(values.value ?? "");
                }
              }}
              {...{
                name: id ?? name,
                id: (id || name).replace(/[* ]/g, ""),
                disabled,
                placeholder,
                autoFocus,
                tabIndex,
              }}
            />
          ) : !maxLength || maxLength < 31 ? (
            <input {...inputProps} />
          ) : (
            <textarea {...inputProps} rows={3} />
          )}
        </div>
        {!!description && <small>{description}</small>}
      </MyInputStyle>
    );
  }
);
