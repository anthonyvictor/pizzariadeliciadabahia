import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { LancheStyle } from "@styles/pages/pedido/lanche/styles";
import { useMyOrder } from "@context/myOrderContext";
import { ButtonSecondary } from "@styles/components/buttons";
import { IOutro } from "@models/outro";
import ItemQuantityModal from "@components/itemQuantityModal";
import { formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { sleep } from "@util/misc";
import Loading from "@components/loading";
import Image from "next/image";
import { env } from "@config/env";
import Text from "@components/text";
import BottomControls from "@components/pedido/bottomControls";

const Lanche: NextPage = () => {
  const { addItem } = useMyOrder();
  const [selectedItem, setSelectedItem] = useState<IOutro | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(false);
  const router = useRouter();

  const [lanches, setLanches] = useState<IOutro[]>([]);

  const loadItems = async () => {
    try {
      const lanchesFromBackend = (await (
        await fetch(`${env.apiURL}/lanches`, {
          headers: { "Content-Type": "application/json" },
        })
      ).json()) as IOutro[];
      setLanches(lanchesFromBackend.map((x) => ({ ...x, tipo: "OUTRO" })));
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
    router.push("/pedido");
  };
  const cancelQuantity = () => {
    selectItem(null);
    setQuantity(1);
  };

  return (
    <LancheStyle>
      {lanches.length ? (
        <>
          <Text type="title">LANCHES / OUTROS</Text>
          <div className="menu">
            <ul>
              {lanches
                .filter((x) => x.visivel)
                .map((lanche) => (
                  <li
                    key={lanche.nome}
                    className={`${!lanche.disponivel ? "disabled" : undefined}`}
                    onClick={() => selectItem(lanche)}
                  >
                    <div className="left">
                      <Image
                        loader={() => lanche.imagemUrl}
                        src={lanche.imagemUrl}
                        width={110}
                        height={90}
                        objectFit={"cover"}
                      />
                    </div>

                    <div className="right">
                      <h5 className="title">{lanche.nome.toUpperCase()}</h5>
                      <p className="value">{formatCurrency(lanche.valor)}</p>
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
    </LancheStyle>
  );
};

export default Lanche;
