import { IItemBuilderLanche } from "tpdb-lib";
import { LancheBuilderStyle } from "./styles";
import { useEffect, useState } from "react";
import { useItemBuilder } from "src/views/pedido/itemBuilder/context";
import { ILanche } from "tpdb-lib";
import { IItemPedidoIds } from "tpdb-lib";
import { ItemBuilderObservacoes } from "../../observacoes";

export const LancheBuilder = ({
  builder,
}: {
  currentItem?: ILanche;
  builder: IItemBuilderLanche;
  nextEl: string;
}) => {
  const { setItensFinais } = useItemBuilder();

  const [prod, setProd] = useState<IItemPedidoIds & { builderId: string }>({
    ...builder.lanche,
    builderId: builder.id,
    tipo: "lanche",
    lancheOriginal: builder.lanche.id,
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
  }, []); //eslint-disable-line
  return (
    <LancheBuilderStyle id={`builder-${builder.id}`}>
      <ItemBuilderObservacoes
        builderId={builder.id}
        de="do lanche"
        placeholder=""
        observacoes={prod.observacoes}
        setObservacoes={(observacoes) =>
          setProd((prev) => ({ ...prev, observacoes }))
        }
      />
    </LancheBuilderStyle>
  );
};
