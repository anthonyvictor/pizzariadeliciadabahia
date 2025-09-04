import { MdLocalOffer, MdPeople } from "react-icons/md";
import { ProdutosViewStyle } from "./styles";
import {
  FaCogs,
  FaGlassCheers,
  FaHamburger,
  FaHotdog,
  FaMap,
} from "react-icons/fa";
import { IMyButton } from "../util/types";
import { MyButton } from "../components/myButton";
import { useAuth } from "../../auth";
import TextContainer from "@components/textContainer";
import { IoPizza } from "react-icons/io5";
import { IoFastFoodSharp } from "react-icons/io5";

export const ProdutosView = () => {
  useAuth();
  const buttons: IMyButton[] = [
    {
      titulo: "Pizzas",
      url: "/loja/app/produtos/pizzas",
      Icone: IoPizza,
      cor: "#ff8e32",
    },
    {
      titulo: "Bebidas",
      url: "/loja/app/produtos/bebidas",
      Icone: FaGlassCheers,
      cor: "#f7e72f",
    },
    {
      titulo: "Lanches",
      url: "/loja/app/produtos/lanches",
      Icone: FaHotdog,
      cor: "#4d7bf9",
    },
    {
      titulo: "Combos",
      url: "/loja/app/produtos/combos",
      Icone: IoFastFoodSharp,
      cor: "#0cb235",
    },
  ];

  return (
    <ProdutosViewStyle>
      <TextContainer title="Produtos" subtitle="Escolha uma das opções" />
      {buttons.map((bt) => (
        <MyButton {...bt} />
      ))}
    </ProdutosViewStyle>
  );
};
