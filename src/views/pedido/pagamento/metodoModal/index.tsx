import { ModalContainer, ModalOverlay } from "@styles/components/modal";
import { MetodoModalStyle } from "./styles";
import TextContainer from "@components/textContainer";
import { IMetodo } from "../types";
import { IPagamentoPedido } from "tpdb-lib";
import { colors } from "@styles/colors";
import { MyInput } from "@components/pedido/myInput";
import { useState } from "react";
import { formatCurrency } from "@util/format";
import BottomControls from "@components/pedido/bottomControls";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { toNum } from "@util/conversion";

export const MetodoModal = ({
  m,
  valorDefinido,
  valorTotal,
  onClose,
  onConfirm,
}: {
  m: IMetodo;
  onConfirm: (pag: IPagamentoPedido) => void;
  onClose: () => void;
  valorTotal: number;
  valorDefinido: number;
}) => {
  const [valorStr, setValorStr] = useState(
    (valorTotal - valorDefinido).toString()
  );
  const [trocoStr, setTrocoStr] = useState("");
  const [naoPrecisaTroco, setNaoPrecisaTroco] = useState(false);

  // const [valTroco, setValTroco] = useState<{tipo: 'semTroco'}|{tipo: 'comTroco', troco: number}>()

  return (
    <ModalOverlay>
      <ModalContainer>
        <MetodoModalStyle>
          <TextContainer
            subtitle={m.titulo}
            subtitleColor={colors.elements}
            description={`Você pode pagar o total ${m.legenda} ou pode mesclar outras formas de pagamento.`}
          />
          <>
            <div className="valor-total">
              <MyInput
                type="currency"
                name="Valor:"
                max={valorTotal - valorDefinido}
                //   autoFocus={true}
                value={valorStr}
                setValue={(v) => setValorStr(v as string)}
              />
              {/* <button onClick={() => setValor(valorTotal.toString())}>
                      Total
                    </button> */}
            </div>
            {m.tipo == "especie" && (
              <>
                <MyInput
                  className="troco"
                  type="currency"
                  name="Preciso de troco para"
                  placeholder="Troco para..."
                  disabled={naoPrecisaTroco}
                  // min={Number(valor)}
                  // max={(valor ? Number(valor) : 1) + 199}
                  // autoFocus={true}
                  value={naoPrecisaTroco ? "" : trocoStr}
                  setValue={(v) => setTrocoStr(v as string)}
                />
                <MyInput
                  className="sem-troco"
                  type="checkbox"
                  id="semtroco"
                  name="Não preciso de troco"
                  checked={naoPrecisaTroco}
                  setChecked={(c) => {
                    setNaoPrecisaTroco(c);
                  }}
                />
              </>
            )}
            {!!m.cupom && (
              <small className="cupom">
                Pagando o total {m.legenda}, você vai ter{" "}
                {m.cupom.tipo === "percentual"
                  ? `${m.cupom.valor}%`
                  : `${formatCurrency(m.cupom.valor)}`}{" "}
                de desconto!
              </small>
            )}
          </>

          <BottomControls
            notFixed
            secondaryButton={{
              text: "Voltar",
              click: () => onClose(),
            }}
            primaryButton={{
              text: "Continuar",

              click: () => {
                const valor = valorStr;
                const troco = trocoStr;

                if (
                  !valor.replace(/,\./g, "") ||
                  isNaN(toNum(valor)) ||
                  toNum(valor) <= 0
                ) {
                  toast.error("Valor do pagamento inválido!");

                  return;
                } else if (
                  !!troco &&
                  (isNaN(toNum(troco)) || toNum(troco) < toNum(valor))
                ) {
                  toast.error('"Troco para..." inválido!');

                  return;
                } else if (m.tipo === "especie" && !troco && !naoPrecisaTroco) {
                  toast.error("Informe se vai precisar ou não de troco!");

                  return;
                }

                onConfirm({
                  id: uuidv4(),
                  tipo: m.tipo,
                  trocoPara: troco ? toNum(troco) : toNum(valor),
                  valor: toNum(valor),
                } as IPagamentoPedido);
              },
            }}
          />
        </MetodoModalStyle>
      </ModalContainer>
    </ModalOverlay>
  );
};
