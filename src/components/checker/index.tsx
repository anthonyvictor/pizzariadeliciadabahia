import { CheckerStyle } from "./styles";

export const Checker = ({
  checked,
  check,
  disabled,
  disabledText,
}: {
  checked: boolean;
  check?: () => void;
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
