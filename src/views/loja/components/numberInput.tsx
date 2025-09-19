import { NumberInput as NumberInputOriginal } from "@components/NumberInput";
import { MyInputStyle } from "@components/pedido/myInput/styles";
import { colors } from "@styles/colors";
import { HTMLProps, ReactNode } from "react";

export const NumberInput = ({
  id,
  disabled,
  label,
  value,
  setValue,
  style,
}: {
  id: string;
  disabled?: boolean;
  label: string | ReactNode;
  value: number;
  setValue: (val: number) => void;
  style?: HTMLProps<HTMLDivElement>["style"];
}) => {
  return (
    <MyInputStyle className={id} style={{ border: "none" }}>
      <div className="input-label" style={{ flexDirection: "column" }}>
        {label && (typeof label === "string" ? <label>{label}</label> : label)}

        {/* <input
          id={id}
          name={id}
          min={0}
          type="number"
          disabled={disabled}
          value={value}
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
          }}
          onChange={(e) => {
            setValue(Number(e.target.value));
          }}
        /> */}

        <NumberInputOriginal
          style={
            style ?? {
              backgroundColor: colors.backgroundDark,
              borderRadius: "5px",
            }
          }
          forceMin={true}
          editable={true}
          min={0}
          disabled={disabled}
          allowVoid={false}
          value={value}
          setValue={(e) => {
            setValue(e);
          }}
        />
      </div>
    </MyInputStyle>
  );
};
