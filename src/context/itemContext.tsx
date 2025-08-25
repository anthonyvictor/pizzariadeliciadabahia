import { SetState } from "@config/react";
import {
  IBebidaPedido,
  IItemPedidoIds,
  ILanchePedido,
  IPedido,
} from "tpdb-lib";
import { IItemBuilder } from "tpdb-lib";
import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { env } from "@config/env";
import { toast } from "react-toastify";

export type ItemComBuilder = IItemPedidoIds & { builderId: string };

interface IItemBuilderContext {
  itensFinais: ItemComBuilder[];
  setItensFinais: SetState<ItemComBuilder[]>;
  observacoes: string;
  setObservacoes: SetState<string>;
  builder: IItemBuilder | null;
  continuar: (qtd: number) => Promise<void>;
}
const ItemBuilderContext = createContext<IItemBuilderContext>(
  {} as IItemBuilderContext
);

export const ItemBuilderProvider = ({
  children,
  builder,
  pedido,
}: {
  children: ReactNode;
  builder: IItemBuilder | null;
  pedido: IPedido;
}) => {
  const [itensFinais, setItensFinais] = useState<ItemComBuilder[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const router = useRouter();

  const continuar = async (qtd: number) => {
    try {
      const itens = [];
      const comboId = builder.tipo === "combo" ? builder.combo.id : undefined;
      const arr = Array(qtd).fill("");

      arr.forEach(() => {
        const grupoId = builder.tipo === "combo" ? uuidv4() : undefined;
        const _itens = itensFinais.map((x) => {
          const obj: IItemPedidoIds = { ...x, observacoes };
          obj.comboId = comboId;
          obj.grupoId = grupoId;
          return obj;
        });
        itens.push(..._itens);
      });

      await axios.post(`${env.apiURL}/pedidos/itens`, {
        pedidoId: pedido.id,
        itens,
      });

      router.push("/pedido");
    } catch (err) {
      toast.error("Oops, não foi possível adicionar esse item no momento!");
    }
  };

  return (
    <ItemBuilderContext.Provider
      value={{
        itensFinais,
        setItensFinais,
        builder,
        observacoes,
        setObservacoes,
        continuar,
      }}
    >
      {children}
    </ItemBuilderContext.Provider>
  );
};

export const useItemBuilder = () => useContext(ItemBuilderContext);
