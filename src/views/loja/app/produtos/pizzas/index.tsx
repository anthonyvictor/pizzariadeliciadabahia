import { MdLocalOffer, MdPeople } from "react-icons/md";
import { PizzasViewStyle } from "./styles";
import {
  FaCogs,
  FaGlassCheers,
  FaHamburger,
  FaHotdog,
  FaMap,
  FaPlus,
  FaRuler,
} from "react-icons/fa";
import { IMyButton } from "../../util/types";
import { MyButton } from "../../components/myButton";
import { useAuth } from "../../../auth";
import TextContainer from "@components/textContainer";
import { IoPizza } from "react-icons/io5";
import { IoFastFoodSharp } from "react-icons/io5";
import { GiCoolSpices } from "react-icons/gi";
import { BiSolidDoughnutChart } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { MdAnchor } from "react-icons/md";

export const PizzasView = () => {
  useAuth();
  const buttons: IMyButton[] = [
    {
      titulo: "Tamanhos",
      url: "/loja/app/produtos/pizzas/tamanhos",
      Icone: FaRuler,
      cor: "#82a3ff",
    },
    {
      titulo: "Sabores",
      url: "/loja/app/produtos/pizzas/sabores",
      Icone: GiCoolSpices,
      cor: "#ff8e32",
    },
    {
      titulo: "Bordas",
      url: "/loja/app/produtos/pizzas/bordas",
      Icone: BiSolidDoughnutChart,
      cor: "#f7e72f",
    },
    {
      titulo: "Pontos",
      url: "/loja/app/produtos/pizzas/pontos",
      Icone: BsFire,
      cor: "#ff4040",
    },
    {
      titulo: "Espessuras",
      url: "/loja/app/produtos/pizzas/espessuras",
      Icone: MdAnchor,
      cor: "#b85aff",
    },
    {
      titulo: "Extras",
      url: "/loja/app/produtos/pizzas/extras",
      Icone: FaPlus,
      cor: "#0cb235",
    },
  ];

  return (
    <PizzasViewStyle>
      <TextContainer title="Pizzas" subtitle="Escolha uma das opções" />
      {buttons.map((bt) => (
        <MyButton {...bt} />
      ))}
    </PizzasViewStyle>
  );
};
