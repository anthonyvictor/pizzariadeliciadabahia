import { FlagEmojiToPNG } from "@util/conversion";
import { SaborStyle } from "./styles";

export const Sabor = ({
  nome,
  descricao,
  valuesString,
  showCheckBox = false,
  ingredientesDoLado = false,
  active,
  checked,
  setChecked,
  className,
  forPrint = false,
}: {
  nome: string;
  descricao: string;
  valuesString?: string;
  showCheckBox?: boolean;
  ingredientesDoLado?: boolean;
  active: boolean;
  checked?: boolean;
  className?: string;
  setChecked?: (boolean) => void;
  forPrint?: boolean;
}) => (
  <SaborStyle
    style={!forPrint && !active ? { opacity: 0.4, pointerEvents: "none" } : {}}
    showCheckBox={showCheckBox}
    ingredientesDoLado={ingredientesDoLado}
    className={`${className ?? ""}${!forPrint && !active ? "disabled" : ""}`}
    onClick={(e) =>
      showCheckBox &&
      e.target === e.currentTarget &&
      active &&
      setChecked(!checked)
    }
  >
    {showCheckBox && (
      <div className="left">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => active && setChecked(!checked)}
          />
          <span />
        </label>
      </div>
    )}
    <div className="right">
      <span className="flavour-name">
        <h5>{`${nome}`}</h5>
        {/* <h5>{`${nome.split(" ").slice(0, -1).join(" ")}`}</h5> */}
        {/* <h5>{FlagEmojiToPNG(nome.split(" ").pop())}</h5> */}
      </span>
      <p className="flavour-ingredients">{descricao}</p>
      {!!valuesString && <p className="flavour-values">{valuesString}</p>}
    </div>
  </SaborStyle>
);
