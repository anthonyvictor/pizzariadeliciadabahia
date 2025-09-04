import { useAuth } from "../../auth";
import { PedidosViewStyle } from "./style";

export const PedidosView = () => {
  useAuth();
  return <PedidosViewStyle></PedidosViewStyle>;
};
