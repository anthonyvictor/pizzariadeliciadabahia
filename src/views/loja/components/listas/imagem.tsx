import Image from "next/image";
import styled from "styled-components";

export const Imagem = ({ url }: { url: string | undefined }) => {
  return (
    <>
      {url && (
        <Style className="img-container">
          <Image src={url} layout="fill" />
        </Style>
      )}
    </>
  );
};

const Style = styled.div`
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #fff;
  position: relative;
  width: 60px;
  height: 60px;
`;
