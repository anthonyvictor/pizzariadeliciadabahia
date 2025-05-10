import { NextPage } from "next";
import { useEffect, useState } from "react";
import { BebidaStyle } from "@styles/pages/pedido/bebida/styles";
import { useMyOrder } from "@context/myOrderContext";
import { ButtonSecondary } from "@styles/components/buttons";
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

const Bebida: NextPage = () => {
  const { addItem } = useMyOrder();
  const [selectedItem, setSelectedItem] = useState<IOutro | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(false);
  const router = useRouter();

  const [bebidas, setBebidas] = useState<IOutro[]>([]);

  const loadItems = async () => {
    try {
      const bebidasFromBackend = (await (
        await fetch(`${env.apiURL}/bebidas`, {
          headers: { "Content-Type": "application/json" },
        })
      ).json()) as IOutro[];
      setBebidas(bebidasFromBackend.map((x) => ({ ...x, tipo: "bebida" })));
    } catch (err) {
      console.error((err as Error).message, (err as Error).stack);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const selectItem = (item: IOutro) => {
    setSelectedItem(item);
    setShowQuantityModal(item ? true : false);
  };

  const confirmQuantity = async (item: IOutro) => {
    setShowQuantityModal(false);
    let itens: Array<IOutro> = Array(quantity).fill({});
    itens = itens.map((i) => (i = { ...item, id: uuidv4() }));
    addItem(itens);
    // await sleep();
    router.push("/pedido");
  };
  const cancelQuantity = () => {
    selectItem(null);
    setQuantity(1);
  };

  const replaceType = (name: string) => {
    return name.replace(/(REFRIGERANTE|CERVEJA) /g, "");
  };
  return (
    <BebidaStyle>
      {bebidas.length ? (
        <>
          <Text type="title">BEBIDA</Text>
          <div className="menu">
            <ul>
              {bebidas
                .filter((x) => x.visivel)
                .map((bebida) => (
                  <li
                    key={bebida.nome}
                    className={`${!bebida.disponivel ? "disabled" : undefined}`}
                    onClick={() => selectItem(bebida)}
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
                      <p className="value">{formatCurrency(bebida.valor)}</p>
                    </div>
                  </li>
                ))}
            </ul>
            <ItemQuantityModal
              item={selectedItem}
              value={quantity}
              setValue={setQuantity}
              showModal={showQuantityModal}
              confirm={() => confirmQuantity(selectedItem)}
              cancel={cancelQuantity}
            />
          </div>
          <BottomControls backButton />
        </>
      ) : (
        <Loading />
      )}
    </BebidaStyle>
  );
};

export default Bebida;
