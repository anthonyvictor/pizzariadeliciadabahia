import { colors } from "@styles/colors";
import { isImageUrl, isValidUrl } from "@util/conversion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaClipboard, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";

export const ImageEditor = ({
  imagemUrl,
  setImagemUrl,
  objectFit = "cover",
}: {
  imagemUrl: string | undefined;
  setImagemUrl: (url: string | undefined) => void;
  objectFit?: "scale-down" | "cover" | "contain" | "fill";
}) => {
  const [img, setImg] = useState(imagemUrl);

  useEffect(() => {
    setImg(imagemUrl);
  }, [imagemUrl]);
  return (
    <ImageEditorStyle>
      <div
        className="img-container"
        onClick={() => {
          if (imagemUrl) {
            window.open(imagemUrl, "_blank");
          }
        }}
      >
        {img && (
          <Image
            src={imagemUrl ?? ""}
            layout="fill"
            objectFit={objectFit}
            objectPosition={"center center"}
            onError={() => setImg(undefined)}
          />
        )}
      </div>
      <div className="img-buttons">
        <button
          type="button"
          title="Colar imagem"
          onClick={async () => {
            const url = await navigator.clipboard.readText();
            if (
              url &&
              isValidUrl(url.trim()) &&
              (await isImageUrl(url.trim()))
            ) {
              setImagemUrl(url.trim());
            } else {
              toast.error("URL inválida!");
            }
          }}
        >
          <FaClipboard />
        </button>
        <button title="Remover imagem" onClick={() => setImagemUrl(undefined)}>
          <FaTrash />
        </button>
      </div>
    </ImageEditorStyle>
  );
};

const ImageEditorStyle = styled.div`
  display: grid;
  width: 130px;
  height: 100px;
  grid-template-columns: 1fr 30px;
  gap: 2px;
  margin: 10px;
  flex-shrink: 0;

  .img-container {
    position: relative;
    flex: 1;
    overflow: hidden;
    border-radius: 10px;
    background-color: #fff;
  }
  .img-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
    button {
      flex: 1;
      color: ${colors.elements};
      background-color: transparent;
      border: none;
      font-size: 1.5rem;
    }
  }
`;
