import { Checker } from "@components/checker";
import { colors } from "@styles/colors";
import styled from "styled-components";
import { IProdutoBase } from "tpdb-lib";

export const Checkers = ({
  item,
  infoExtra = [],
}: {
  item: IProdutoBase & { somenteEmCombos?: boolean };
  infoExtra?: string[];
}) => {
  return (
    <Style className="checkers">
      <div className="disponivel">
        <Checker label={"Disp."} checked={item.disponivel} />
      </div>
      <div className="visivel">
        <Checker label={"Visi."} checked={item.visivel} />
      </div>
      {item.somenteEmCombos && (
        <div className="so-combo">
          <Checker label={"S.Comb"} checked={item.somenteEmCombos} />
        </div>
      )}
      <div className="vendidos">
        <small>🛒{item.vendidos}</small>
      </div>
      {infoExtra.map((x, i) => (
        <div key={i} className="info-extra">
          <small>{x}</small>
        </div>
      ))}
    </Style>
  );
};

const Style = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  .checker {
    width: 15px;
    height: 15px;
    border: 1px solid ${colors.elements};
    zoom: 0.8;
  }
`;
