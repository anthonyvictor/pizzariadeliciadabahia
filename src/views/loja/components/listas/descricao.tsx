export const Descricao = ({
  descricao,
  full,
}: {
  descricao: string | undefined;
  full?: boolean;
}) => {
  return (
    <>
      {!!descricao && (
        <small
          style={{ fontSize: full ? ".6rem" : ".7rem" }}
          className="descricao"
        >
          {full ? descricao : descricao.split(" ").slice(0, 5).join(" ")}
        </small>
      )}
    </>
  );
};
