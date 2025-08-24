import { usePedidoPage } from "../context";
import { NavStyle } from "./styles";
import { Tab } from "./tab";

export const Nav = () => {
  const { home, destaques } = usePedidoPage();
  const menus: { i: string; l: string; a: Array<any> }[] = [
    {
      i: "destaques",
      l: "+ Vend 🔥",
      a: destaques,
    },
    { i: "combos", l: "Promos 🏷️", a: home.combos },
    { i: "pizzas", l: "Pizzas 🍕", a: home.tamanhos },
    { i: "bebidas", l: "Bebs. 🍹", a: home.bebidas },
    { i: "lanches", l: "Outros 🍦", a: home.lanches },
  ];

  return (
    <NavStyle>
      {menus
        .filter((x) => x.a.length)
        .map(({ i, l }) => (
          <Tab key={i} id={i} label={l} />
        ))}
    </NavStyle>
  );
};
