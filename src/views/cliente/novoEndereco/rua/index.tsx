import TextContainer from "@components/textContainer";
import { RuaViewStyle } from "./styles";
import { InputAndList } from "./components/input-list";
import dynamic from "next/dynamic";

const Mapa = dynamic(
  () => {
    if (typeof window === "undefined" || !window)
      return Promise.resolve(() => null);
    return import("./components/mapa");
  },
  { ssr: false }
);

export const RuaView = () => {
  return (
    <RuaViewStyle className="no-scroll">
      <TextContainer
        title="Endereço"
        description="Pesquise seu endereço, ou arraste o pino no mapa até o local"
      />
      <Mapa />
      <InputAndList />
    </RuaViewStyle>
  );
};
