import { NextPage } from "next";
import { useEffect, useState } from "react";
import { BebidaStyle } from "./styles";
import { useMyOrder } from "@context/myOrderContext";
import { ButtonPrimary, ButtonSecondary } from "@styles/components/buttons";
import { IOutro } from "@models/outro";
import ItemQuantityModal from "@components/itemQuantityModal";
import { formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Loading from "@components/loading";
import Image from "next/image";
import { env } from "@config/env";
import Text from "@components/text";
import BottomControls from "@components/pedido/bottomControls";
import Modal from "@components/modal";

const BebidaModal = ({
  next,
}: {
  next: (item: IOutro | undefined) => void;
}) => {
  const { addItem } = useMyOrder();
  const [selectedItem, setSelectedItem] = useState<IOutro | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(false);
  const router = useRouter();

  const [bebidas, setBebidas] = useState<IOutro[]>([]);

  const [nextInactive, setNextInactive] = useState<boolean>(false);

  const _next = (bb: IOutro | undefined) => {
    setNextInactive(true);
    next(bb);
  };
  const loadItems = async () => {
    try {
      const bebidasFromBackend = (await (
        await fetch(`${env.apiURL}/bebidas`, {
          headers: { "Content-Type": "application/json" },
        })
      ).json()) as IOutro[];

      const r = bebidasFromBackend
        .map((x) => ({ ...x, tipo: "bebida" }))
        .filter(
          (x) =>
            x.nome.toLowerCase().includes("refri") &&
            x.valor === 7 &&
            !x.nome.toLowerCase().includes("zero")
        );
      setBebidas(r as IOutro[]);
    } catch (err) {
      console.error((err as Error).message, (err as Error).stack);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const selectItem = (item: IOutro) => {
    setSelectedItem(item);
    _next(item);
    // setShowQuantityModal(item ? true : false);
  };

  // const confirmQuantity = async (item: IOutro) => {
  //   setShowQuantityModal(false);
  //   let itens: Array<IOutro> = Array(quantity).fill({});
  //   itens = itens.map((i) => (i = { ...item, id: uuidv4() }));
  //   addItem(itens);
  //   // await sleep();
  //   router.push("/pedido");
  // };
  // const cancelQuantity = () => {
  //   selectItem(null);
  //   setQuantity(1);
  // };

  const replaceType = (name: string) => {
    return name.replace(/(REFRIGERANTE|CERVEJA) /g, "");
  };

  const [modalTemCtz, setModalTemCtz] = useState(false);

  return (
    <>
      <Modal
        className="bebida-modal"
        label="Você ganhou uma bebida grátis!"
        description={`Selecione uma das opções abaixo`}
        type={"custom"}
        buttons={
          <>
            {/* <ButtonPrimary
                onClick={() => {
                  next();
                }}
                >
                Pronto!
              </ButtonPrimary> */}
            <ButtonSecondary
              onClick={() => {
                setModalTemCtz(true);
              }}
            >
              ❌ Não quero bebida grátis
            </ButtonSecondary>
          </>
        }
      >
        <BebidaStyle>
          {bebidas.length ? (
            <>
              <div className="menu">
                <ul className="bebidas">
                  {bebidas
                    .filter((x) => x.visivel)
                    .map((bebida) => (
                      <li
                        key={bebida.nome}
                        className={`${
                          !bebida.disponivel ? "disabled" : undefined
                        }`}
                        onClick={() => {
                          if (!nextInactive) {
                            selectItem(bebida);
                          }
                        }}
                      >
                        <div className="left">
                          <Image
                            loader={() => bebida.imagemUrl}
                            src={bebida.imagemUrl}
                            layout="fill"
                          />
                        </div>

                        <div className="right">
                          <h5 className="title">
                            {replaceType(bebida.nome.toUpperCase())}
                          </h5>
                          {/* <p className="value">{formatCurrency(bebida.valor)}</p> */}
                        </div>
                      </li>
                    ))}
                </ul>
                {/* <ItemQuantityModal
              item={selectedItem}
              value={quantity}
              setValue={setQuantity}
              showModal={showQuantityModal}
              confirm={() => confirmQuantity(selectedItem)}
              cancel={cancelQuantity}
              /> */}
              </div>
            </>
          ) : (
            <Loading />
          )}
        </BebidaStyle>
      </Modal>
      {modalTemCtz && (
        <Modal
          className="tem-ctz-modal"
          label="Tem certeza que não quer bebida?"
          description={`O valor continuará o mesmo`}
          type={"custom"}
          buttons={
            <>
              <ButtonPrimary
                onClick={() => {
                  setModalTemCtz(false);
                }}
              >
                ❇️ Quero a bebida grátis
              </ButtonPrimary>
              <ButtonSecondary
                disabled={nextInactive}
                onClick={() => {
                  setModalTemCtz(false);
                  _next(undefined);
                }}
              >
                ❌ Não quero bebida grátis
              </ButtonSecondary>
            </>
          }
        />
      )}
    </>
  );
};

export default BebidaModal;
