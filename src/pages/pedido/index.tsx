import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import {
  BebidaLi,
  ComboLi,
  LancheLi,
  PedidoStyle,
  ProdGrid,
  ProdGroup,
  ProdList,
  TamanhoLi,
} from "@styles/pages/pedido/styles";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import { useEffect, useState } from "react";
import Loading from "@components/loading";
import { IPizzaTamanho, ICombo, IBebida, ILanche, IPedido } from "tpdb-lib";
import Image from "next/image";
import { formatCurrency } from "@util/format";
import { tamanhoDescricao } from "@util/pizza";
import { abreviarBebida } from "@util/bebidas";
import { IHome } from "tpdb-lib";
import Link from "next/link";
import { colors } from "@styles/colors";
import axios from "axios";
import { toast } from "react-toastify";
import { ICookies } from "@models/cookies";
import { useAuth } from "@util/hooks/auth";
import { env } from "@config/env";
import { obterCookies } from "@util/cookies";

const Pedido: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const router = useRouter();
  const [closedUntil, setClosedUntil] = useState<Date | null | undefined>(
    new Date("2025-09-10 00:00:00")
  );

  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  // useEffect(() => {
  //const [isLoaded, setIsLoaded] = useState<boolean>(false);
  //   (async () => {
  //     const { closedUntil: _closedUntil } = (await (
  //       await fetch(`${env.apiURL}/loja`)
  //     ).json()) ?? { closedUntil: null };
  //     setIsLoaded(true);
  //     setClosedUntil(_closedUntil);
  //   })();
  // }, []);

  const [items, setItems] = useState<IHome>();
  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(`${env.apiURL}/pages/home?clienteId=${clienteId}`)
        .then((res) => {
          setItems(res.data);
        })
        .catch((err) => {
          toast.error("Erro ao carregar dados");
          console.error(err);
        });
    }
  }, [authCarregado]);

  if (!authCarregado) return <Loading />;

  if (!isLoaded) return <Loading />;

  // if (closedUntil && new Date(closedUntil) > new Date())
  if (closedUntil && new Date(closedUntil) > new Date())
    return (
      <PedidoStyle>
        <TextContainer
          title="OPA! ESTAMOS FECHADOS NESTE MOMENTO."
          subtitle="NOSSO HORÁRIO 
       DE FUNCIONAMENTO É DE TERÇA À DOMINGO, DAS 18:30 ATÉ ÀS 23:30"
        />
        <div
          onClick={() => {
            setClosedUntil(null);
          }}
          style={{
            backgroundColor: colors.background,
            color: colors.backgroundDark,
          }}
        >
          ......
        </div>
      </PedidoStyle>
    );

  const Tab = ({ id, label }: { id: string; label: string }) => {
    return (
      <button
        id={`tab-button-${id}`}
        className="tab-button"
        onClick={() => {
          const el = document.querySelector(`#${id}-ul`);
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        {label}
      </button>
    );
  };

  const Ul = ({
    id,
    label,
    itens,
  }: {
    id: string;
    label: string;
    itens: (
      | ICombo
      | IPizzaTamanho
      | (IBebida & { tipo: "bebida" })
      | (ILanche & { tipo: "lanche" })
    )[];
  }) => {
    const iZero = itens[0];

    const [locked, setLocked] = useState(false);
    return (
      <ProdGroup id={`${id}-ul`}>
        <header>
          <h2>{label}</h2>
        </header>
        {"produtos" in iZero ? (
          <ProdGrid>
            {itens.map((prod: ICombo) => (
              <ComboLi
                key={`${prod.id ?? prod.nome}`}
                combo={prod}
                disabled={locked}
                onClick={() => {
                  setLocked(true);
                  router.push(`/pedido/item/combo/${prod.id}`);
                }}
              >
                <aside className="prod-img">
                  <Image src={prod.imagemUrl} layout="fill" priority />
                </aside>
                <aside className="conteudo">
                  <h5>{prod.nome}</h5>
                  <p style={{ fontSize: "0.7rem" }}>{prod.descricao}</p>
                  <h6>À partir de {formatCurrency(prod.valorMin)}</h6>
                </aside>
              </ComboLi>
            ))}
          </ProdGrid>
        ) : "maxSabores" in iZero ? (
          <ProdList>
            {itens.map((prod: IPizzaTamanho) => (
              <TamanhoLi
                key={prod.id ?? prod.nome}
                tamanho={prod}
                disabled={locked}
                onClick={() => {
                  setLocked(true);
                  router.push(`/pedido/item/pizza/${prod.id}`);
                }}
              >
                <aside className="prod-img">
                  <Image src={prod.imagemUrl} layout="fill" priority />
                </aside>
                <aside className="conteudo">
                  <h5>Pizza {prod.nome}</h5>
                  <p style={{ fontSize: "0.7rem" }}>{tamanhoDescricao(prod)}</p>
                  <h6>À partir de {formatCurrency(prod.valorMin)}</h6>
                </aside>
              </TamanhoLi>
            ))}
          </ProdList>
        ) : iZero.tipo === "bebida" ? (
          <ProdList>
            {itens.map((prod: IBebida & { tipo: "bebida" }) => (
              <BebidaLi
                key={prod.id ?? prod.nome}
                bebida={prod}
                disabled={locked}
                onClick={() => {
                  setLocked(true);
                  router.push(`/pedido/item/bebida/${prod.id}`);
                }}
              >
                <aside className="prod-img">
                  <Image
                    src={prod.imagemUrl}
                    width={40}
                    height={60}
                    objectFit="scale-down"
                    priority
                  />
                </aside>
                <aside className="conteudo">
                  <h5>{abreviarBebida(prod.nome)}</h5>
                  <h6>{formatCurrency(prod.valor)}</h6>
                </aside>
              </BebidaLi>
            ))}
          </ProdList>
        ) : (
          <ProdList>
            {itens.map((prod: ILanche & { tipo: "lanche" }) => (
              <LancheLi
                key={prod.id ?? prod.nome}
                lanche={prod}
                disabled={locked}
                onClick={() => {
                  setLocked(true);
                  router.push(`/pedido/item/lanche/${prod.id}`);
                }}
              >
                <aside className="prod-img">
                  <Image
                    src={prod.imagemUrl}
                    width={60}
                    height={60}
                    style={{ flexShrink: 0 }}
                    objectFit="cover"
                    priority
                  />
                </aside>
                <aside className="conteudo">
                  <h5>{prod.nome}</h5>
                  <p style={{ fontSize: "0.7rem" }}>{prod.descricao}</p>
                  <h6>{formatCurrency(prod.valor)}</h6>
                </aside>
              </LancheLi>
            ))}
          </ProdList>
        )}
      </ProdGroup>
    );
  };

  const menus: { i: string; l: string; a: Array<any> }[] = [
    { i: "combos", l: "Promos 🏷️", a: items.combos },
    { i: "pizzas", l: "Pizzas 🍕", a: items.tamanhos },
    { i: "bebidas", l: "Bebidas 🍹", a: items.bebidas },
    { i: "lanches", l: "Lanches 🍔", a: items.lanches },
  ];

  return (
    <PedidoStyle
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <TextContainer title="Monte seu pedido" />

      <div className="menu">
        <nav>
          {menus
            .filter((x) => x.a.length)
            .map(({ i, l }) => (
              <Tab key={i} id={i} label={l} />
            ))}
        </nav>

        <div className="uls no-scroll">
          {!!items.combos.length && (
            <Ul id={"combos"} label={"Promoções 🏷️"} itens={items.combos} />
          )}
          {!!items.tamanhos.length && (
            <Ul id={"pizzas"} label={"Pizzas 🍕"} itens={items.tamanhos} />
          )}
          {!!items.bebidas.length && (
            <Ul id={"bebidas"} label={"Bebidas 🍹"} itens={items.bebidas} />
          )}
          {!!items.lanches.length && (
            <Ul id={"lanches"} label={"Lanches 🍔"} itens={items.lanches} />
          )}
        </div>

        {!pedido.codigoCupom && (
          <div className="cupom">
            Tem um código de cupom?{" "}
            <Link href={"/pedido/cupom"}>Digite aqui</Link>
          </div>
        )}
      </div>
      {/* <Dots items={items} /> */}
      <BottomControls
        secondaryButton={{
          click: () => {
            setIsLoaded(false);
            router.push("/pedido/itens");
          },
          disabled: (pedido?.itens?.length ?? 0) < 1,
          text: "MEUS ITENS",
          badge: pedido?.itens?.length,
        }}
        primaryButton={{
          click: () => {
            // if (
            //   pedido?.itens.some((x) =>
            //     [
            //       "CERVEJA",
            //       "SUCO",
            //       "REFRIGERANTE",
            //       "REFRI",
            //       "COCA",
            //       "AGUA",
            //       "SUKITA",
            //       "PEPSI",
            //       "ANTÁRCTICA",
            //       "ÁGUA",
            //     ].some((y) => (x as IOutro)?.nome?.toUpperCase().includes(y))
            //   )
            // ) {
            setIsLoaded(false);
            router.push(`/pedido/tipo`);
            // } else {
            //   askIfCustomerWantsDrink();
            // }
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

export default Pedido;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
