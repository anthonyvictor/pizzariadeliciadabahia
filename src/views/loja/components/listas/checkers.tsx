import { Checker } from "@components/checker";
import { colors } from "@styles/colors";
import styled from "styled-components";
import { IProdutoBase } from "tpdb-lib";

export const Checkers = ({
  item,
  infoExtra = [],
  setStat,
}: {
  item: IProdutoBase & { somenteEmCombos?: boolean };
  setStat?: (stat: {
    t: "disponivel" | "visivel" | "somenteEmCombos";
    v: boolean;
  }) => void;
  infoExtra?: string[];
}) => {
  const Bt = ({
    l,
    k,
    h,
  }: {
    l: string;
    k: "disponivel" | "visivel" | "somenteEmCombos";
    h?: boolean;
  }) => {
    return (h && item[k]) || !h ? (
      <button
        className={`chk ${item[k] ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setStat?.({ t: k, v: !item[k] });
        }}
      >
        {l}
      </button>
    ) : (
      <></>
    );
  };
  return (
    <Style className="checkers">
      <aside>
        <Bt l="Disp." k="disponivel" />
        <Bt l="Visi." k="visivel" />
        <Bt l="So.Comb." k="somenteEmCombos" h={true} />
      </aside>
      <aside>
        <div className="vendidos">
          <small>🛒{item.vendidos ?? 0}</small>
        </div>
        {infoExtra.map((x, i) => (
          <div key={i} className="info-extra">
            <small>{x}</small>
          </div>
        ))}
      </aside>
    </Style>
  );
};

const Style = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  aside {
    display: flex;
    gap: 5px;
    align-items: center;
    .checker {
      /* width: 15px;
    height: 15px; */
      border: 1px solid ${colors.elements};
      /* zoom: 0.8; */
    }

    .chk {
      background-color: ${colors.backgroundDark};
      border: 2px solid #fff;
      padding: 5px 15px;
      border-radius: 5px;
      color: #fff;
      cursor: pointer;
      &.active {
        color: #000;
        background-color: ${colors.elements};
      }
    }
  }
`;
