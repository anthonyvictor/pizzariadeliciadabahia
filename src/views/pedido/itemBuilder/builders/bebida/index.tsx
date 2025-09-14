import { IItemBuilderBebida } from "tpdb-lib";
import { BebidaBuilderStyle } from "./styles";
import { useEffect, useState } from "react";
import { useItemBuilder } from "src/views/pedido/itemBuilder/context";
import { IBebidaPedido, IItemPedidoIds } from "tpdb-lib";
import { ItemBuilderObservacoes } from "../../observacoes";

export const BebidaBuilder = ({
  builder,
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
          prev[i] = prod;
        } else {
          prev.push(prod);
        }

        return prev;
      });
    }
  }, [prod]); //eslint-disable-line
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
