import { IProdutoBase } from "tpdb-lib";

export const Descricao = ({
  item,
  full,
}: {
  item: IProdutoBase;
  full?: boolean;
}) => {
  return (
    <>
      {item.descricao && (
        <small
          style={{ fontSize: full ? ".6rem" : ".7rem" }}
          className="descricao"
        >
          {full
            ? item.descricao
            : item.descricao.split(" ").slice(0, 5).join(" ")}
        </small>
      )}
    </>
  );
};
