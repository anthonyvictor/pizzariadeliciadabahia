import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useMyOrder } from "@context/myOrderContext";
import { Button, ButtonPrimary } from "@styles/components/buttons";
import { formatCurrency } from "@util/format";
import { useRouter } from "next/router";
import { PagamentoStyle } from "@styles/pages/pedido/pagamento/styles";
import { v4 as uuidv4 } from "uuid";
import { PaymentMethod } from "@components/pedido/paymentMethod";
import { ButtonBankNote } from "@components/pedido/bankNoteButton";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import Modal from "@components/modal";
import { colors } from "@styles/colors";
import { usePromo } from "@context/promoContext";
import { taxaGratisAteTalHoras } from "@util/promo";
import Loading from "@components/loading";

const Pagamento: NextPage = () => {
  const { myOrder, addPayment, removeAllPayments, setFee } = useMyOrder();
  const { getTaxaGratis, getTaxaGratis36 } = usePromo();

  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextInactive, setNextInactive] = useState<boolean>(false);
  const [bankNoteInactive, setBankNoteInactive] = useState<boolean>(false);
  const [trocoParaInput, setTrocoParaInput] = useState<string>("");
  const [data, setData] = useState<{
    valor: number;
    trocoPara: number;
    tipo: "especie" | "cartao" | "pix";
  }>({
    valor:
      myOrder && myOrder.itens?.length
        ? myOrder.itens.reduce((acc, item) => acc + item.valor, 0) +
          (getTaxaGratis(myOrder.itens) || getTaxaGratis36(myOrder.itens)
            ? 0
            : myOrder.taxaEntrega)
        : 0,
    trocoPara: 0,
    tipo: null,
  });
  const [showNeedChangeModal, setShowNeedChangeModal] =
    useState<boolean>(false);
  const [showChangeModal, setShowChangeModal] = useState<boolean>(false);

  useEffect(() => {
    if (
      !myOrder ||
      (myOrder?.itens ?? [])?.length < 1 ||
      (myOrder?.cliente?.nome ?? "") === "" ||
      (myOrder?.cliente?.whatsapp ?? "") === "" ||
      (myOrder?.tipo === "entrega" && (myOrder.cliente?.endereco ?? "") === "")
    ) {
      router.push("/pedido");
    } else {
      // setFee(fee);
      removeAllPayments();
      setIsLoaded(true);
    }
  }, []);

  const setSelectedBankNote = (value: number) => {
    setData((prev) => ({
      ...prev,
      trocoPara: prev.trocoPara === value ? 0 : value,
    }));
  };
  const [finalData, setFinalData] = useState<
    | {
        valor: number;
        trocoPara: number;
        tipo: "especie" | "cartao" | "pix";
      }
    | undefined
  >();
  const setSelectedPaymentMethod = (value: "especie" | "cartao" | "pix") => {
    const newData = { ...data, tipo: data.tipo === value ? null : value };
    setData(newData);
    setFinalData(newData);
  };

  useEffect(() => {
    if (finalData) {
      data.tipo === "especie" ? setShowNeedChangeModal(true) : next();
    }
  }, [finalData]);

  const MakeButtonBankNote = ({
    value,
    click,
  }: {
    value: number;
    click: () => void;
  }) => {
    return (
      <ButtonBankNote
        value={value}
        disabled={
          data.tipo !== "especie" || data.valor >= value || bankNoteInactive
        }
        selected={data.tipo === "especie" && data.trocoPara === value}
        click={() => {
          setBankNoteInactive(true);
          if (click) {
            click();
          } else if (setSelectedBankNote) {
            setSelectedBankNote(value);
          }
        }}
      />
    );
  };
  const MakePaymentMethod = ({
    type,
  }: {
    type: "especie" | "cartao" | "pix";
  }) => (
    <PaymentMethod
      type={type}
      selected={data.tipo === type}
      click={setSelectedPaymentMethod}
    />
  );

  const next = (trocoPara?: number) => {
    setNextInactive(true);
    addPayment({
      id: uuidv4(),
      ...data,
      trocoPara: trocoPara ?? data.trocoPara,
    });
    setIsLoaded(false);
    router.push(
      `/pedido/confirmacao${
        myOrder.tipo === "entrega"
          ? `/${myOrder.cliente.endereco.bairroId}`
          : ""
      }`
    );
  };

  return !isLoaded ? (
    <Loading />
  ) : (
    <PagamentoStyle>
      <TextContainer
        title="PAGAMENTO"
        subtitle={`VALOR TOTAL ${formatCurrency(data.valor)}`}
        description={
          myOrder?.tipo === "entrega"
            ? getTaxaGratis(myOrder.itens) ||
              getTaxaGratis36(myOrder.itens) ||
              taxaGratisAteTalHoras(myOrder)
              ? ` (Você ganhou entrega GRÁTIS!)`
              : myOrder?.taxaEntrega > 0
              ? ` (ITENS + ENTREGA)`
              : ` (ENDEREÇO NÃO ENCONTRADO, FALTA INCLUIR TAXA DE ENTREGA)`
            : undefined
        }
      />

      <div className="menu">
        <div className="inputs-changes-methods">
          <div className="methods">
            <span className="input-label">SELECIONE UM MÉTODO:</span>
            <ul>
              {((myOrder?.itens ?? []).some((x) =>
                (x.observacao ?? "").toUpperCase().includes("PROMO")
              )
                ? ["especie", "pix"]
                : ["cartao", "especie", "pix"]
              ).map((x) => (
                <MakePaymentMethod
                  key={x}
                  type={x as "especie" | "cartao" | "pix"}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <BottomControls
        backButton
        // primaryButton={{
        //   click: () => {
        //     data.tipo === "especie" ? setShowNeedChangeModal(true) : next();
        //   },
        //   disabled: nextInactive || !data || !data.tipo,
        // }}
      />
      {showNeedChangeModal && (
        <Modal
          className="change-modal"
          label="Você vai precisar de troco?"
          type={"custom"}
        >
          <div style={{ display: "flex" }}>
            <Button
              bgcolor={colors.elements}
              forecolor={colors.background}
              onClick={() => {
                setShowNeedChangeModal(false);
                setShowChangeModal(false);
                if (!(nextInactive || !data || !data.tipo)) next();
              }}
            >
              O dinheiro está trocado!
            </Button>

            <Button
              bgcolor={colors.elements}
              forecolor={colors.background}
              onClick={() => {
                setShowNeedChangeModal(false);
                setShowChangeModal(true);
              }}
            >
              Preciso de troco para...
            </Button>
          </div>
        </Modal>
      )}
      {showChangeModal && (
        <Modal
          className="change-modal"
          label="Troco para quanto?"
          description="Se for possível, facilita o troco pra gente.. 💞"
          type={"custom"}
          buttons={
            <>
              <ButtonPrimary
                disabled={
                  !trocoParaInput ||
                  isNaN(Number(trocoParaInput)) ||
                  Number(trocoParaInput) < data.valor
                }
                onClick={() => {
                  setShowNeedChangeModal(false);
                  setShowChangeModal(false);
                  if (!(nextInactive || !data || !data.tipo))
                    next(Number(trocoParaInput));
                }}
              >
                Pronto!
              </ButtonPrimary>
            </>
          }
        >
          <input
            type="number"
            autoFocus
            placeholder="Ex: R$ 50,00"
            step={0.5}
            value={trocoParaInput}
            onChange={(e) => setTrocoParaInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (
                  !(
                    !trocoParaInput ||
                    isNaN(Number(trocoParaInput)) ||
                    Number(trocoParaInput) < data.valor
                  )
                ) {
                  setShowNeedChangeModal(false);
                  setShowChangeModal(false);
                  if (!(nextInactive || !data || !data.tipo))
                    next(Number(trocoParaInput));
                }
              }
            }}
          />
          <div className="changes-wrapper">
            {[5, 10, 20, 50, 100, 200].map((x) => (
              <MakeButtonBankNote key={x} value={x} click={() => next(x)} />
            ))}
          </div>
        </Modal>
      )}
    </PagamentoStyle>
  );
};

export default Pagamento;
