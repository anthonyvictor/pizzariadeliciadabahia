import { ItemBuilderStyle } from "./styles";
import { useItemBuilder } from "@context/itemContext";
import { ItemBuilderHeader } from "./header";
import { ComboBuilder } from "./builders/combo";
import { PizzaBuilder } from "./builders/pizza";
import { ItemBuilderObservacoes } from "./observacoes";
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
  //   const [closedUntil, setClosedUntil] = useState<Date | null | undefined>();

  //   const askIfCustomerWantsDrink = () => {
  //     setShowModal(true);
  //   };

  //   useEffect(() => {
  //     (async () => {
  //       const { closedUntil: _closedUntil } = (await (
  //         await fetch(`${env.apiURL}/loja`)
  //       ).json()) ?? { closedUntil: null };
  //       setIsLoaded(true);
  //       setClosedUntil(_closedUntil);
  //     })();
  //   }, []);

  //   if (!isLoaded) return <Loading />;

  //   if (closedUntil && new Date(closedUntil) > new Date())
  //     return (
  //       <>
  //         <TextContainer title="OPA! ESTAMOS FECHADOS NESTE MOMENTO." />
  //       </>
  //     );
  //   if (!item)
  //     return (
  //       <>
  //         <TextContainer title="Oops! Este item está indisponível." />
  //         <ButtonSecondary onClick={() => router.back()}>Voltar</ButtonSecondary>
  //       </>
  //     );

  // Fecha modal com botão voltar do celular
  useEffect(() => {
    const handlePopState = () => {
      router.replace("/pedido");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
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
