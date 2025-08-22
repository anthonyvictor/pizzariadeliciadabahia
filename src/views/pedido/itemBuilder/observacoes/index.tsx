import { ItemBuilderObservacoesStyle } from "./styles";

export const ItemBuilderObservacoes = ({
  de,
  builderId,
  placeholder,
  observacoes,
  setObservacoes,
}: {
  de: string;
  builderId: string;
  placeholder: string;
  observacoes: string | undefined;
  setObservacoes: (observacoes: string | undefined) => void;
}) => {
  const maxLength = 95;
  return (
    <ItemBuilderObservacoesStyle id={`observacoes-${builderId}`}>
      <header>
        <label>Observações {de}</label>
        <small>
          {observacoes?.length ?? 0}/{maxLength}
        </small>
      </header>
      <textarea
        maxLength={maxLength}
        placeholder={placeholder}
        rows={2}
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
      />
    </ItemBuilderObservacoesStyle>
  );
};
