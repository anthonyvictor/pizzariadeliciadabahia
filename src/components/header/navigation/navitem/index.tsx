import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useNavigation } from "@context/navigationContext";
import { NavItemStyle } from "./styles";
import { INavigationItem } from "@models/navigationItem";

const NaviItem: FC<{ item: INavigationItem }> = ({ item }) => {
  const router = useRouter();
  const { setMenuOpen } = useNavigation();
  return (
    <Link href={item.route} passHref>
      <NavItemStyle
        onClick={() => {
          setMenuOpen(false);
        }}
      >
        {router.pathname === item.route ? (
          <b>{item.name}</b>
        ) : (
          <span>{item.name}</span>
        )}
      </NavItemStyle>
    </Link>
  );
};
export default NaviItem;
