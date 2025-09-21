import { MyInput } from "@components/pedido/myInput";
import { NumberInput } from "./numberInput";
import styled from "styled-components";
import { colors } from "@styles/colors";

export const NomeInput = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  return (
    <MyInput
      name="Nome"
      type="text"
      value={value}
      setValue={(val) => setValue(String(val))}
    />
  );
};
export const DescricaoInput = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  return (
    <MyInput
      name="Descrição"
      type="text"
      maxLength={80}
      value={value}
      setValue={(val) => setValue(String(val))}
    />
  );
};
export const EstoqueInput = ({
  value,
  setValue,
}: {
  value: number | null | undefined;
  setValue: (val: number | null | undefined) => void;
}) => {
  return (
    <NumberInput
      id={"estoque"}
      disabled={value == null}
      value={value}
      setValue={(val) => {
        setValue(val);
      }}
      label={
        <label
          htmlFor="estoque"
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <span>Estoque</span>
          <input
            type="checkbox"
            checked={value != null}
            onChange={(e) => {
              setValue(e.target.checked ? 1 : undefined);
              // setTamanho((prev) => ({
              //   ...prev,
              //   estoque: e.target.checked ? 1 : undefined,
              // }));
              setTimeout(() => {
                const el = document.querySelector(
                  "#estoque"
                ) as HTMLInputElement;
                el?.focus();
                el?.select();
              }, 0);
            }}
          />
        </label>
      }
    />
  );
};

export const Checkers = ({
  disponivel,
  setDisp,
  visivel,
  setVis,
  somenteEmCombos,
  setSoCombos,
}: {
  disponivel: boolean | undefined;
  setDisp: (val: boolean) => void;

  visivel: boolean | undefined;
  setVis: (val: boolean) => void;

  somenteEmCombos?: boolean;
  setSoCombos?: (val: boolean) => void;
}) => {
  return (
    <CheckersStyle>
      <MyInput
        name="Disponível"
        type="checkbox"
        checked={disponivel == null ? true : disponivel}
        setChecked={
          (checked) => setDisp(checked)
          // setTamanho((prev) => ({ ...prev, disponivel: checked }))
        }
      />
      <MyInput
        name="Visível"
        type="checkbox"
        checked={visivel == null ? true : visivel}
        setChecked={
          (checked) => setVis(checked)
          // setTamanho((prev) => ({ ...prev, visivel: checked }))
        }
      />
      {!!setSoCombos && (
        <MyInput
          name="Só combos"
          type="checkbox"
          checked={!!somenteEmCombos}
          setChecked={
            (checked) => setSoCombos(checked)
            // setTamanho((prev) => ({ ...prev, somenteEmCombos: checked }))
          }
        />
      )}
    </CheckersStyle>
  );
};

const CheckersStyle = styled.div`
  display: flex;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 3px;
  > * {
    flex: 1;
    background-color: ${colors.backgroundDark};
    border-radius: 5px;
    padding: 5px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    label {
      font-size: 0.7rem;
    }
  }
`;
