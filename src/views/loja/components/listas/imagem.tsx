import Image from "next/image";
import { useEffect, useState } from "react";
import { IoImage } from "react-icons/io5";
import { MdImage } from "react-icons/md";
import styled from "styled-components";

export const Imagem = ({
  url,
  aspectRatio = "square",
}: {
  url: string | undefined;
  aspectRatio?: "portrait" | "landscape" | "square";
}) => {
  const [img, setImg] = useState(url);
  useEffect(() => {
    setImg(url);
  }, [url]);
  return (
    <>
      <Style
        className="img-container"
        style={{
          width: aspectRatio === "portrait" ? "40px" : "60px",
        }}
      >
        {img ? (
          <Image
            src={img}
            layout="fill"
            objectFit={aspectRatio === "portrait" ? "contain" : "cover"}
            onError={() => setImg(undefined)}
          />
        ) : (
          <div className="img-skeleton">
            <MdImage />
          </div>
        )}
      </Style>
    </>
  );
};

const Style = styled.div`
  overflow: hidden;
  border-radius: 5px;
  /* border: 2px solid #fff; */
  background-color: #fff;
  position: relative;
  /* width: 60px; */
  height: 60px;

  .img-skeleton {
    flex: 1;
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #727272;
  }
`;
