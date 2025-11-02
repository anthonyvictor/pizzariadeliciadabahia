import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
  InputHTMLAttributes,
} from "react";

type DatetimeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "min" | "max"
> & {
  value: Date | null;
  onChange: (newDate: Date | null) => void;
  min?: Date | null;
  max?: Date | null;
};

function dateToStr(date: Date | null): string {
  if (!date || isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

function strToDate(value: string): Date | null {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const d = new Date(year, month - 1, day, hour, minute);
  return isNaN(d.getTime()) ? null : d;
}

export type DatetimeInputRef = {
  focus: () => void;
  getValue: () => Date | null;
};

export const DatetimeInput = forwardRef<DatetimeInputRef, DatetimeInputProps>(
  ({ value, onChange, onBlur, min, max, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [strValue, setStrValue] = useState<string>(() => dateToStr(value));

    useEffect(() => {
      setStrValue(dateToStr(value));
    }, [value]);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      getValue: () => strToDate(strValue),
    }));

    return (
      <input
        {...rest}
        ref={inputRef}
        type="datetime-local" // 🔹 mudou aqui
        value={strValue}
        min={dateToStr(min ?? null)}
        max={dateToStr(max ?? null)}
        onChange={(e) => setStrValue(e.target.value)}
        onBlur={(e) => {
          const newDate = strToDate(strValue);
          onChange(newDate);
          setStrValue(dateToStr(newDate));
          onBlur?.(e);
        }}
      />
    );
  }
);
