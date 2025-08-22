import { createContext, FC, ReactNode, useContext } from "react";

const PaymentContext = createContext<{
  // itensTaxados: IItem[];
  // taxaMaquininha: number;
  // totalTaxa: number;
  // totalPedido: number;
  // valorItensTaxados: number;
}>(null);

const PaymentProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // const [itensTaxados, setItensTaxados] = useState<IItem[]>([]);
  // const valorItensTaxados =
  //   itensTaxados?.length > 0
  //     ? itensTaxados.reduce((acc, curr) => acc + curr.valor, 0)
  //     : 0;

  // const { promos } = usePromo();
  // const { pedido } = usePedido();

  // const getValores = (itens: IItem[]) =>
  //   itens.reduce((acc, curr) => acc + curr.valor, 0);

  // const getValorTaxaRestante = (pagamentos: IPagamento[]) => {};
  // const totalTaxa = itensTaxados.length
  //   ? getValores(itensTaxados) -
  //     getValores(
  //       (pedido.itens ?? []).filter((x) =>
  //         itensTaxados.some((y) => y.id === x.id)
  //       )
  //     )
  //   : 0;

  // useEffect(() => {
  //   setItensTaxados([]);
  //   const _itensTaxados: IItem[] = [];
  //   (pedido?.itens ?? []).forEach((item) => {
  //     if (item.promoId) {
  //       const itemPromo = promos.find((x) => x.id === item.promoId);
  //       if (itemPromo?.taxaMaquininha) {
  //         _itensTaxados.push({
  //           ...item,
  //           valorComTaxa: Math.ceil(item.valor * (1 + taxaMaquininha / 100)),
  //         });
  //       }
  //     }
  //   });
  //   setItensTaxados(_itensTaxados);
  // }, [pedido?.itens]);

  // const { getTaxaGratis, getTaxaGratis36 } = usePromo();

  // const totalPedido =
  //   pedido && pedido.itens?.length
  //     ? pedido.itens.reduce((acc, item) => acc + item.valor, 0) +
  //       (getTaxaGratis(pedido.itens) || getTaxaGratis36(pedido.itens)
  //         ? 0
  //         : pedido.taxaEntrega)
  //     : 0;
  return (
    <PaymentContext.Provider
      value={
        {
          // itensTaxados,
          // taxaMaquininha,
          // totalTaxa,
          // totalPedido,
          // valorItensTaxados,
        }
      }
    >
      {children}
    </PaymentContext.Provider>
  );
};
export default PaymentProvider;

export const usePayment = () => {
  return useContext(PaymentContext);
};
