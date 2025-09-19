import Link from "next/link";
import { MyButtonStyle } from "./styles";
import { IMyButton } from "../../app/util/types";

export const MyButton = ({ Icone, titulo, url, cor }: IMyButton) => {
  return (
    <Link passHref href={url}>
      <MyButtonStyle>
        <div className="icone">
          <Icone color={cor} />
        </div>
        <span className="titulo">{titulo}</span>
      </MyButtonStyle>
    </Link>
  );
};
