import { MdLocalOffer, MdPeople } from "react-icons/md";
import { HomeViewStyle } from "./styles";
import { FaCogs, FaMap } from "react-icons/fa";
import { IMyButton } from "../util/types";
import { MyButton } from "../components/myButton";
import { useAuth } from "../../auth";
import TextContainer from "@components/textContainer";
import { IoPizza } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

export const HomeView = () => {
  useAuth();
  const buttons: IMyButton[] = [
    {
      titulo: "Pedidos",
      url: "/loja/app/pedidos",
      Icone: FaShoppingCart,
      cor: "#ff3298",
    },
    {
      titulo: "Clientes",
      url: "/loja/app/clientes",
      Icone: MdPeople,
      cor: "#4d7bf9",
    },
    {
      titulo: "Produtos",
      url: "/loja/app/produtos",
      Icone: IoPizza,
      cor: "#ff8e32",
    },
    {
      titulo: "Endereços",
      url: "/loja/app/enderecos",
      Icone: FaMap,
      cor: "#0cb235",
    },
    {
      titulo: "Cupons",
      url: "/loja/app/cupons",
      Icone: MdLocalOffer,
      cor: "#f7e72f",
    },
    {
      titulo: "Configurações",
      url: "/loja/app/configs",
      Icone: FaCogs,
      cor: "#e3e3e3",
    },
  ];

  return (
    <HomeViewStyle>
      <TextContainer
        title="Sistema Gestor PDB"
        subtitle="Escolha uma das opções"
      />
      {buttons.map((bt) => (
        <MyButton {...bt} />
      ))}
    </HomeViewStyle>
  );
};
