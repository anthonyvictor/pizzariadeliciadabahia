import { useAuth } from "../../auth";
import { EnderecosViewStyle } from "./styles";

export const EnderecosView = () => {
  useAuth();
  return <EnderecosViewStyle>enderecos</EnderecosViewStyle>;
};
