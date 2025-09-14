import styled from "styled-components";

export const Indisp = ({
  prod: { disponivel, emCondicoes, visivel, estoque },
}: {
  prod: {
    disponivel: boolean;
    visivel: boolean;
    emCondicoes: boolean;
    estoque?: number;
  };
}) => {
  if (disponivel && visivel && emCondicoes && estoque !== 0) return <></>;
  return (
    <Style>
      <span className="s1">Produto</span>
      <span className="s2">Indisponível</span>
    </Style>
  );
};

const Style = styled.small`
  display: flex;
  flex-direction: column;
  align-items: center;

  .s1 {
    font-size: 0.6rem;
  }
  .s2 {
    font-size: 0.5rem;
  }
`;
