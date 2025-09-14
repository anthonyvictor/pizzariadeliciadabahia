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
  useEffect(() => {
    const handlePopState = () => {
      router.replace("/pedido");
      return false; // impede a navegação normal
    };

    router.beforePopState(handlePopState);

    return () => {
      // importante: volta o comportamento ao padrão quando desmontar
      router.beforePopState(() => true);
    };
  }, [router]);

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
