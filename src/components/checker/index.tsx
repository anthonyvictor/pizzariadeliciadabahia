import { CheckerStyle } from "./styles";

export const Checker = ({
  checked,
  label,
  check,
  disabled,
  disabledText,
}: {
  checked: boolean;
  check?: () => void;
  label?: string;
  disabled?: boolean;
  disabledText?: string;
}) => {
  return (
    <CheckerStyle
      checked={checked}
      onClick={() => {
        if (!disabled) check?.();
      }}
    >
      {label && <small>{label}</small>}
      {disabled ? (
        <h5>{disabledText ?? `Indisp.`}</h5>
      ) : (
        <div className="checker">
          <span></span>
        </div>
      )}
    </CheckerStyle>
  );
};
