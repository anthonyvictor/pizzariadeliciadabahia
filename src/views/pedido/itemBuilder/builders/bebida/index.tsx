import { IItemBuilderBebida } from "tpdb-lib";
import { BebidaBuilderStyle } from "./styles";
import { useEffect, useState } from "react";
import { useItemBuilder } from "@context/itemContext";
import { IBebidaPedido, IItemPedido, IItemPedidoIds } from "tpdb-lib";
import { ItemBuilderObservacoes } from "../../observacoes";

export const BebidaBuilder = ({
  currentItem,
  builder,
  nextEl,
}: {
  currentItem?: IBebidaPedido;
  builder: IItemBuilderBebida;
  nextEl: string;
}) => {
  const { setItensFinais } = useItemBuilder();
  const [prod, setProd] = useState<IItemPedidoIds & { builderId: string }>({
    ...builder.bebida,
    builderId: builder.id,
    tipo: "bebida",
    bebidaOriginal: builder.bebida.id,
    id: undefined,
    desconto: 0,
  });
  useEffect(() => {
    if (prod) {
      setItensFinais((_prev) => {
        const prev = [..._prev];
        const i = prev.findIndex((x) => x.builderId === builder.id);
        if (i > -1) {
          prev[i] = prod as any;
        } else {
          prev.push(prod as any);
        }

        return prev;
      });
    }
  }, [prod]);
  return (
    <BebidaBuilderStyle id={`builder-${builder.id}`}>
      <ItemBuilderObservacoes
        builderId={builder.id}
        de="da bebida"
        placeholder=""
        observacoes={prod.observacoes}
        setObservacoes={(observacoes) =>
          setProd((prev) => ({ ...prev, observacoes }))
        }
      />
    </BebidaBuilderStyle>
  );
};
