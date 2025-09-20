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
import { usePedidoStore } from "src/infra/zustand/pedido";

export type ItemComBuilder = IItemPedidoIds & { builderId: string };

interface IItemBuilderContext {
  itensFinais: ItemComBuilder[];
  setItensFinais: SetState<ItemComBuilder[]>;
  builder: IItemBuilder | null;
  continuar: (qtd: number) => Promise<void>;
  aberto: boolean;
}
const ItemBuilderContext = createContext<IItemBuilderContext>(
  {} as IItemBuilderContext
);

export const ItemBuilderProvider = ({
  children,
  builder,
  aberto,
}: {
  children: ReactNode;
  builder: IItemBuilder | null;
  aberto: boolean;
}) => {
  const [itensFinais, setItensFinais] = useState<ItemComBuilder[]>([]);
  const router = useRouter();
  const { pedido } = usePedidoStore();
  const continuar = async (qtd: number) => {
    try {
      const itens: IItemPedidoIds[] = [];
      const comboId = builder.tipo === "combo" ? builder.combo.id : undefined;
      const arr = Array(qtd).fill("");

      arr.forEach(() => {
        const grupoId = builder.tipo === "combo" ? uuidv4() : undefined;
        const _itens = itensFinais.map((x) => {
          const obj: IItemPedidoIds = { ...x };
          obj.comboId = comboId;
          obj.grupoId = grupoId;
          return obj;
        });
        itens.push(..._itens);
      });

      const pizza = itens.find((x) => x.tipo === "pizza");
      if (pizza) {
        localStorage.setItem("preferencias_borda", pizza.borda ?? "");
        localStorage.setItem("preferencias_ponto", pizza.ponto ?? "");
        let saboresPref = (
          localStorage.getItem("preferencias_sabores") ?? ""
        ).split(",");
        saboresPref = Array.from(
          new Set([...(pizza.sabores ?? []), ...saboresPref])
        ).slice(0, 4); // guarda só os 3 últimos sabores
        localStorage.setItem("preferencias_sabores", saboresPref.join(","));
      }

      await axios.post(`${env.apiURL}/pedidos/itens`, {
        pedidoId: pedido.id,
        itens,
      });

      router.replace("/pedido");
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
        continuar,
        aberto,
      }}
    >
      {children}
    </ItemBuilderContext.Provider>
  );
};

export const useItemBuilder = () => useContext(ItemBuilderContext);
