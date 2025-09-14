import { ButtonPrimary, ButtonSecondary } from "@styles/components/buttons";
import styled from "styled-components";

export const EditorBottom = ({ fechar }: { fechar: () => void }) => {
  return (
    <Style>
      <ButtonSecondary type="button" onClick={fechar}>
        Voltar
      </ButtonSecondary>
      <ButtonPrimary pulse={false} type="submit">
        Salvar
      </ButtonPrimary>
    </Style>
  );
};

const Style = styled.footer`
  display: grid;
  grid-template-columns: 100px 1fr;
`;
