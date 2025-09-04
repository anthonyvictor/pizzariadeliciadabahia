import { useAuth } from "../../auth";
import { ConfigsViewStyle } from "./styles";

export const ConfigsView = () => {
  useAuth();
  return <ConfigsViewStyle>configs</ConfigsViewStyle>;
};
