import { ItemBuilderStyle } from "./styles";
import { useItemBuilder } from "src/views/pedido/itemBuilder/context";
import { ItemBuilderHeader } from "./header";
import { ComboBuilder } from "./builders/combo";
import { PizzaBuilder } from "./builders/pizza";
import { ItemBuilderFooter } from "./footer";
import { BebidaBuilder } from "./builders/bebida";
import { LancheBuilder } from "./builders/lanche";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePopState } from "@util/hooks/popState";

export const ItemBuilderView = () => {
  const { builder } = useItemBuilder();
  const router = useRouter();

  //   const { pedido } = usePedido();
  //   const router = useRouter();
  //   const [showModal, setShowModal] = useState<boolean>(false);
  //   const [isLoaded, setIsLoaded] = useState<boolean>(false);

  //   const askIfCustomerWantsDrink = () => {
  //     setShowModal(true);
  //   };

  //   if (!item)
  //     return (
  //       <>
  //         <TextContainer title="Oops! Este item está indisponível." />
  //         <ButtonSecondary onClick={() => router.back()}>Voltar</ButtonSecondary>
  //       </>
  //     );

  usePopState(router, () => {
    router.replace("/pedido");
  });

  return (
    <>
      <ItemBuilderStyle>
        <div className="scrollable-area no-scroll">
          <ItemBuilderHeader />
          {builder.tipo === "combo" ? (
            <ComboBuilder builder={builder} nextEl="observacoes" />
          ) : builder.tipo === "pizza" ? (
            <PizzaBuilder builder={builder} nextEl="observacoes" />
          ) : builder.tipo === "bebida" ? (
            <BebidaBuilder builder={builder} nextEl="observacoes" />
          ) : (
            <LancheBuilder builder={builder} nextEl="observacoes" />
          )}
        </div>
        <ItemBuilderFooter />
      </ItemBuilderStyle>
    </>
  );
};
