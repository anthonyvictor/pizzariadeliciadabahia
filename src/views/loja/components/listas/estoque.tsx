import { NumberInput, NumberInputStyle } from "@components/NumberInput";
import { IProdutoBase } from "tpdb-lib";
import { salvar } from "../../app/util/func";
import { SetState } from "@config/react";
import { HTMLProps, useEffect, useState } from "react";
import { upsertArray } from "@util/state";

export const Estoque = ({
  item,
  chave,
  url,
  setProds,
  editable,
  style,
  className,
  display,
}: {
  item: IProdutoBase;
  url: string;
  setProds: SetState<IProdutoBase[]>;
  chave: string;

  editable?: boolean;
  style?: HTMLProps<HTMLDivElement>["style"];
  display?: "horizontal" | "vertical";
  className?: string;
}) => {
  if (item.id === "656a212781f555282589baa1") {
    console.log(
      "estoqueeeee",
      isNaN(item.estoque) ? ("" as unknown as number) : item.estoque,
      typeof (isNaN(item.estoque) ? ("" as unknown as number) : item.estoque)
    );
  }

  const disabled = !item.disponivel || !item.visivel;

  const min = -1;

  const canDown = (novoNum: number) => novoNum >= min;

  const [upDisabled, setUpDisabled] = useState(false);
  const [downDisabled, setDownDisabled] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const [numValue, setNumValue] = useState(
    item.estoque == null ? -1 : item.estoque
  );
  const [strValue, setStrValue] = useState(
    numValue === -1 ? "" : numValue.toString()
  );

  useEffect(() => {
    setDownDisabled(!canDown(numValue - 1));
  }, [numValue]);

  useEffect(() => {
    const newValue = item.estoque == null ? -1 : item.estoque;
    setNumValue(newValue);
    setStrValue(newValue === -1 ? "" : newValue.toString());
  }, [item.estoque]);

  const save = async (val: number) => {
    const estoque = val >= 99 || val === -1 || val === 0 ? null : val;
    const data = { ...item, estoque };
    await salvar(url, chave, [data]);

    upsertArray(item, setProds, data);
  };

  return (
    <NumberInputStyle
      style={style}
      display={display}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <button
        disabled={disabled || downDisabled}
        tabIndex={editable ? -1 : undefined}
        type={"button"}
        style={{
          visibility: editable
            ? "initial"
            : (numValue ?? 0) > min
            ? "initial"
            : "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();

          const novoNum = Math.max((numValue ?? 0) - 1, min);

          if (!canDown(novoNum)) return;
          setNumValue(novoNum);
          setStrValue(novoNum === -1 ? "" : novoNum.toString());
          save(novoNum);
        }}
      >
        -
      </button>
      <input
        type={"text"}
        style={{
          visibility: editable
            ? "initial"
            : numValue > min
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
        }}
        value={strValue}
        onChange={(e) => {
          const novoNum = Number(
            e.target.value.replace(".", "").replace(",", ".")
          );
          if (novoNum < numValue && !canDown(novoNum)) {
            e.preventDefault();
          } else {
            setStrValue(e.target.value);
            setNumValue(novoNum);
            save(novoNum);
          }
        }}
        onBlur={(e) => {
          setIsFocused(false);
          // if (!allowVoid) {
          //   if (numValue === 0 && strValue.trim() === "") {
          //     setStrValue("0");
          //   }
          // }
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

          const novoNum = Math.max(numValue, 0) + 1;

          setNumValue(novoNum);
          setStrValue(novoNum.toString());
          save(novoNum);
        }}
      >
        +
      </button>
    </NumberInputStyle>
  );
  return (
    <NumberInput
      className="estoque"
      disabled={!item.disponivel || !item.visivel}
      showZero={true}
      value={isNaN(item.estoque) ? ("" as unknown as number) : item.estoque}
      allowVoid={true}
      forceMin={true}
      setValue={async (val) => {
        const estoque = val >= 999 || val === -1 ? undefined : val;

        await salvar(url, chave, [{ ...item, estoque }]);

        setProds((_prev) => {
          const prev = [..._prev];
          const i = prev.findIndex((x) => x.id === item.id);

          if (i > -1) {
            prev[i] = { ...item, estoque };
          }

          return prev;
        });
      }}
      max={999}
      min={-1}
      display={"vertical"}
    />
  );
};
