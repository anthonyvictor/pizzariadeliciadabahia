import { colors } from "@styles/colors";
import styled from "styled-components";
import { IProdutoBase } from "tpdb-lib";

export const Footer = ({
  filtrados,
  itens,
}: {
  itens: IProdutoBase[];
  filtrados: IProdutoBase[];
}) => {
  return (
    <Style>
      <h6 className="len">
        {filtrados?.length} / {itens?.length}
      </h6>
      {(() => {
        const arr = itens.filter((x) => !x.disponivel);

        return !!arr.length && <h6 className="">Indisp: {arr?.length}</h6>;
      })()}
      {(() => {
        const arr = itens.filter((x) => !x.visivel);

        return !!arr.length && <h6 className="">Invis: {arr?.length}</h6>;
      })()}
    </Style>
  );
};

const Style = styled.footer`
  color: #fff;
  padding: 10px 5px;
  border-top: 1px solid #000;
  background-color: ${colors.backgroundDark};
  display: flex;
  gap: 10px;

  font-size: 1.2rem;
`;
