import Loading from "@components/loading";
import { env } from "@config/env";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { usePedidoStore } from "src/infra/zustand/pedido";
import {
  IBebida,
  ICombo,
  IHome,
  ILanche,
  IPedido,
  IPizzaTamanho,
} from "tpdb-lib";
export type IProdutoHome =
  | ICombo
  | IPizzaTamanho
  | (IBebida & {
      tipo: "bebida";
    })
  | (ILanche & {
      tipo: "lanche";
    });
interface IPedidoPageContext {
  home: IHome;
  destaques: IProdutoHome[];
  aberto: boolean;
}

const PedidoPageContext = createContext<IPedidoPageContext>(
  {} as IPedidoPageContext
);

export const PedidoPageProvider = ({
  children,
  aberto,
}: {
  children: ReactNode;
  aberto: boolean;
}) => {
  const [home, setHome] = useState<IHome>();
  const [carregandoHome, setCarregandoHome] = useState(true);
  const { pedido } = usePedidoStore();

  useEffect(() => {
    axios
      .get(`${env.apiURL}/pages/home?clienteId=${pedido.cliente.id}`)
      .then((res) => {
        setHome(res.data);
      })
      .catch((err) => {
        toast.error("Erro ao carregar dados");
        console.error(err);
      })
      .finally(() => {
        setCarregandoHome(false);
      });
  }, []);

  const maxDestaques = 6;
  function fmv<T>(arr: T[], max = 2) {
    return arr
      .sort((a, b) => (b["vendidos"] ?? 0) - (a["vendidos"] ?? 0))
      .slice(0, max);
  }

  const destaques = home
    ? (() => {
        const combos = fmv(home.combos, 4);
        const tamanhos = fmv(home.tamanhos, maxDestaques - (combos.length + 2));
        const bebidas = fmv(
          home.bebidas,
          maxDestaques - (combos.length + tamanhos.length + 1)
        );
        const lanches = fmv(home.lanches, 1);
        const itens = [...combos, ...tamanhos, ...bebidas, ...lanches];

        return fmv(itens, maxDestaques);
      })()
    : [];

  if (carregandoHome) return <Loading />;
  if (!home) return <div>Oops, tivemos um erro ao carregar os dados!</div>;

  return (
    <PedidoPageContext.Provider
      value={{
        home,
        aberto,
        destaques,
      }}
    >
      {children}
    </PedidoPageContext.Provider>
  );
};

export const usePedidoPage = () => {
  return useContext(PedidoPageContext);
};
