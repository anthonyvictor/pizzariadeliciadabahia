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
    home.combos.filter(
      (x) => x.disponivel && x.visivel && x.emCondicoes && x.estoque !== 0,
    ).length
      ? { i: "combos", l: "Promos 🏷️", a: home.combos }
      : undefined,
    { i: "pizzas", l: "Pizzas 🍕", a: home.tamanhos },
    { i: "bebidas", l: "Bebs. 🍹", a: home.bebidas },
    home.lanches.filter(
      (x) => x.disponivel && x.visivel && x.emCondicoes && x.estoque !== 0,
    ).length
      ? { i: "lanches", l: "Outros 🍦", a: home.lanches }
      : undefined,
  ].filter(Boolean);

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
