import { useRouter } from "next/router";
import { PedidoStyle } from "./styles";
import BottomControls from "@components/pedido/bottomControls";
import { Nav } from "./nav";
import { Produtos } from "./produtos";
import { usePedidoPage } from "./context";

export const PedidoView = () => {
  const router = useRouter();

  const { home, destaques, pedido } = usePedidoPage();

  return (
    <PedidoStyle
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {/* <TextContainer title="Monte seu pedido" /> */}

      <div className="menu">
        <Nav />

        <div className="uls no-scroll">
          {!!destaques.length && (
            <Produtos
              id={"destaques"}
              label={"Mais vendidos 🔥"}
              itens={destaques}
            />
          )}
          {!!home.combos.length && (
            <Produtos
              id={"combos"}
              label={"Promoções 🏷️"}
              itens={home.combos}
            />
          )}
          {!!home.tamanhos.length && (
            <Produtos id={"pizzas"} label={"Pizzas 🍕"} itens={home.tamanhos} />
          )}
          {!!home.bebidas.length && (
            <Produtos
              id={"bebidas"}
              label={"Bebidas 🍹"}
              itens={home.bebidas}
            />
          )}
          {!!home.lanches.length && (
            <Produtos
              id={"lanches"}
              label={"Lanches e Outros 🍦"}
              itens={home.lanches}
            />
          )}
        </div>

        {/* {!pedido.codigoCupom && (
          <div className="cupom">
            Tem um código de cupom?{" "}
            <Link href={"/pedido/cupom"}>Digite aqui</Link>
          </div>
        )} */}
      </div>
      <BottomControls
        secondaryButton={{
          click: () => {
            router.push("/pedido/itens");
          },
          disabled: (pedido?.itens?.length ?? 0) < 1,
          text: "MEUS ITENS",
          badge: pedido?.itens?.length,
        }}
        primaryButton={{
          click: () => {
            router.push(`/pedido/tipo`);
          },
          disabled: (pedido?.itens?.length ?? 0) < 1,
        }}
      />

      {/* {somenteOndina && showModalSomenteOndina && (
          <Modal
            label="Área de entrega reduzida!"
            description={`No momento só estamos entregando nos locais abaixo:`}
            type={"custom"}
          >
            <Text type="description">
              Ondina, Rio Vermelho, Barra, Av. Vasco da Gama, Av. Garibaldi, Av.
              Ogunjá e Av. Cardeal da Silva
            </Text>
            <ButtonSecondary
              onClick={() => {
                setShowModalSomenteOndina(false);
              }}
            >
              Ok, entendi!
            </ButtonSecondary>
          </Modal>
        )} */}
    </PedidoStyle>
  );
};
