import { NextPage } from "next";
import { useRouter } from "next/router";
import Carousel from "@components/carousel";
import CarouselItem from "@components/carousel/carouselItem";
import { useMyOrder } from "@context/myOrderContext";
import { PedidoStyle } from "@styles/pages/pedido/styles";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import { Dots } from "@components/dots";
import { env } from "@config/env";
import { IOutro } from "@models/outro";
import { useEffect, useState } from "react";
import Modal from "@components/modal";
import { ButtonPrimary, ButtonSecondary } from "@styles/components/buttons";
import Loading from "@components/loading";
import { usePromo } from "@context/promoContext";
import { Cards } from "@components/modalCards";
import { useNavigation } from "@context/navigationContext";
import Text from "@components/text";

const Pedido: NextPage = () => {
  const { getKids, getDuasRefri60, getGrande29, promosCarregadas } = usePromo();

  const getItems = () => {
    return [
      {
        name: "LANCHES",
        route: "pedido/lanche",
        image: "/images/pedido-lanche.svg",
      },
      {
        name: "PIZZAS",
        route: "pedido/pizza/tamanho",
        image: "/images/pedido-pizza.svg",
      },
      getKids() && {
        name: "",
        route: "pedido/promocao-dia-das-criancas",
        image: "/images/kids.png",
      },
      {
        name: "",
        route: "pedido/promocao-g-rfkt",
        image: "/images/promocao-g-rfkt.png",
      },
      getGrande29() && {
        name: "",
        route: "pedido/promocao-grande-2999",
        image: "/images/promocao-grande-2999.png",
      },
      getDuasRefri60() && {
        name: "",
        route: "pedido/promocao-duas",
        image: "/images/promocao-duas-refri-60.png",
      },
      {
        name: "BEBIDAS",
        route: "pedido/bebida",
        image: "/images/pedido-bebida.svg",
      },
    ].filter(Boolean);
  };

  const [items, setItems] = useState(getItems());

  useEffect(() => {
    if (promosCarregadas) {
      setItems(getItems());
    }

    console.log(
      "getDuasRefri60()",
      getDuasRefri60(),
      "getGrande29()",
      getGrande29()
    );
  }, [promosCarregadas]);

  const { myOrder } = useMyOrder();
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [closedUntil, setClosedUntil] = useState<Date | null | undefined>();

  const askIfCustomerWantsDrink = () => {
    setShowModal(true);
  };

  useEffect(() => {
    (async () => {
      const { closedUntil: _closedUntil } = (await (
        await fetch(`${env.apiURL}/loja`)
      ).json()) ?? { closedUntil: null };
      setIsLoaded(true);
      setClosedUntil(_closedUntil);
    })();
  }, []);

  useEffect(() => {
    if (myOrder?.id) {
      router.push("/pedido/confirmacao");
    }
  }, [myOrder]);

  const { somenteOndina, showModalSomenteOndina, setShowModalSomenteOndina } =
    useNavigation();

  if (!isLoaded) return <Loading />;

  if (closedUntil && new Date(closedUntil) > new Date())
    return (
      <PedidoStyle>
        <TextContainer
          title="OPA! ESTAMOS FECHADOS NESTE MOMENTO."
          subtitle="NOSSO HORÁRIO 
       DE FUNCIONAMENTO É DE TERÇA À DOMINGO, DAS 18:30 ATÉ ÀS 23:30"
        />
      </PedidoStyle>
    );

  return (
    promosCarregadas && (
      <PedidoStyle
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <TextContainer title="MONTE SEU PEDIDO" subtitle="ADICIONE UM ITEM" />

        <div className="menu">
          <Carousel
            length={items.length}
            defaultSelectedIndex={
              promosCarregadas
                ? getDuasRefri60() || getGrande29()
                  ? 2
                  : undefined
                : undefined
            }
          >
            {items.map((item, index) => (
              <CarouselItem
                key={item.route}
                image={{ src: item.image, w: 100 }}
                title={item.name}
                route={item.route}
                index={index}
              />
            ))}
          </Carousel>
        </div>
        <Dots items={items} />
        <BottomControls
          secondaryButton={{
            click: () => router.push("/pedido/itens"),
            disabled: (myOrder?.itens?.length ?? 0) < 1,
            text: "MEUS ITENS",
            badge: myOrder?.itens?.length,
          }}
          primaryButton={{
            click: () => {
              console.log(myOrder?.itens);
              if (
                myOrder?.itens.some((x) =>
                  [
                    "CERVEJA",
                    "SUCO",
                    "REFRIGERANTE",
                    "REFRI",
                    "COCA",
                    "AGUA",
                    "SUKITA",
                    "PEPSI",
                    "ANTÁRCTICA",
                    "ÁGUA",
                  ].some((y) => (x as IOutro)?.nome?.toUpperCase().includes(y))
                )
              ) {
                router.push("/pedido/informacoes-adicionais");
              } else {
                askIfCustomerWantsDrink();
              }
            },
            disabled: (myOrder?.itens?.length ?? 0) < 1,
          }}
        />
        {showModal && (
          <Modal label="Adicionar bebida? 🍹🍻" type={"custom"}>
            <Cards
              items={[
                {
                  id: "n",
                  label: "Sem bebida",
                  image: "/images/card-sem-bebida.png",
                  click: () => {
                    router.push("/pedido/informacoes-adicionais");
                  },
                },
                {
                  id: "a",
                  label: "Quero bebida",
                  image: "/images/card-com-bebida.png",
                  click: () => {
                    router.push("/pedido/bebida");
                  },
                },
              ]}
            />
          </Modal>
        )}

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
    )
  );
};

// const result = await getWorkingTime();
// const hoje = new Date()
//   .toLocaleString("pt-BR", { weekday: "short" })
//   .replace(".", "");

// const dia = result.find((x) => String(x.dia).startsWith(hoje));

// if (!!!dia.inicio) {
//   return {
//     props: {
//       isWorking: true,
//     },
//   };
// }

// const dataInicio = new Date();
// dataInicio.getHours() < 5 && dataInicio.setDate(dataInicio.getDate() - 1);
// dataInicio.setHours(Number(dia.inicio.split(":")[0]) - 2);
// dataInicio.setMinutes(Number(dia.inicio.split(":")[1]));
// dataInicio.setSeconds(0);

// const dataFim = new Date();
// dataFim.getHours() < 5 && dataFim.setDate(dataFim.getDate() - 1);
// dataFim.setHours(Number(dia.fim.split(":")[0]));
// dataFim.setMinutes(Number(dia.fim.split(":")[1]) + 10);
// dataFim.setSeconds(0);

// const dataAtual = new Date();

// console.log(
//   "working:",
//   dataAtual < dataInicio || dataAtual > dataFim ? false : true
// );
// console.log(
//   "atual",
//   dataAtual.toLocaleString(),
//   "inicio",
//   dataInicio.toLocaleString(),
//   "fim",
//   dataFim.toLocaleString()
// );
// return {
//   props: {
//     isWorking: true,
//     // env.environment === "development"
//     // ? true
//     //     : dataAtual < dataInicio || dataAtual > dataFim
//     // dataAtual < dataInicio || dataAtual > dataFim ? false : true,
//   },
// };

export default Pedido;
