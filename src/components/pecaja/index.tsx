import type { FC } from "react";
import { PecaJaButtonStyle } from "./styles";
import { MdDeliveryDining } from "react-icons/md";
import Link from "next/link";

export const PecaJaButton: FC<{
  style: "minimal" | "large";
  closeMenu?: Function;
}> = ({ style, closeMenu }) => {
  return (
    <PecaJaButtonStyle className="peca-ja-button">
      <Link
        href={"/pedido"}
        style={{ textDecoration: "none" }}
        aria-label="Clique aqui para realizar um pedido"
      >
        <button
          onClick={() => closeMenu && closeMenu()}
          className={`noprint peca-ja-button ${style}`}
        >
          <span className="title">PEÇA JÁ</span>
          {style === "large" && <MdDeliveryDining className="icon" />}
        </button>
      </Link>
    </PecaJaButtonStyle>
  );
};
