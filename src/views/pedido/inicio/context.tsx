import Loading from "@components/loading";
import TextContainer from "@components/textContainer";
import { env } from "@config/env";
import { sortDisp } from "@util/array";
import axios from "axios";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { usePedidoStore } from "src/infra/zustand/pedido";
import { IBebida, ICombo, IHome, ILanche, IPizzaTamanho } from "tpdb-lib";
export type IProdutoHome =
  | (ICombo & { tipo: "combo" })
  | (IPizzaTamanho & { tipo: "pizza" })
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
  const router = useRouter();

  useEffect(() => {
    if (!pedido?.id) {
      router.reload();
    } else {
      axios
        .get(`${env.apiURL}/pages/home?pedidoId=${pedido.id}`)
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
    }
  }, []);

  const maxDestaques = 8;
  function fmv<T>(arr: T[], max = 2) {
    return sortDisp(
      [...arr].sort((a, b) => (b["vendidos"] ?? 0) - (a["vendidos"] ?? 0))
    );
  }

  function selecionarDestaques(
    produtos: IProdutoHome[],
    x: number,
    minimos: Partial<Record<IProdutoHome["tipo"], number>>
  ): IProdutoHome[] {
    // 1. pega top X

    let destaques = produtos.slice(0, x);

    const contar = (arr: IProdutoHome[]) =>
      arr.reduce<Record<string, number>>((acc, p) => {
        acc[p.tipo] = (acc[p.tipo] || 0) + 1;
        return acc;
      }, {});

    let contagem = contar(destaques);

    // 2. garante mínimos
    for (const tipo in minimos) {
      const minimo = minimos[tipo as IProdutoHome["tipo"]] || 0;
      const atual = contagem[tipo] || 0;

      if (atual < minimo) {
        const faltam = minimo - atual;

        // candidatos fora do top X, do tipo necessário
        const candidatos = produtos
          .slice(x)
          .filter((p) => p.tipo === tipo)
          .slice(0, faltam);

        for (const c of candidatos) {
          // escolhe o item mais fraco do top X para remover
          const idxSubstituir = destaques
            .map((p, i) => ({ i, vendidos: p.vendidos, tipo: p.tipo }))
            .filter((p) => {
              // só pode remover se o tipo dele não ficar abaixo do mínimo
              const minimoTipo = minimos[p.tipo as IProdutoHome["tipo"]] || 0;
              return (contagem[p.tipo] || 0) > minimoTipo;
            })
            .sort((a, b) => a.vendidos - b.vendidos)[0]?.i; // menor vendido primeiro

          if (idxSubstituir !== undefined) {
            const removido = destaques[idxSubstituir];
            contagem[removido.tipo]--;
            destaques[idxSubstituir] = c;
            contagem[c.tipo] = (contagem[c.tipo] || 0) + 1;
          }
        }
      }
    }

    // mantém a ordenação por "vendidos" no final
    return destaques.sort((a, b) => b.vendidos - a.vendidos);
  }

  const mv = (arr: any[]) =>
    fmv(
      arr.filter((x) => {
        return (
          !x.somenteEmCombos &&
          !!x.emCondicoes &&
          !!x.disponivel &&
          !!x.visivel &&
          x.estoque !== 0
        );
      })
    );

  const destaques = !home
    ? []
    : selecionarDestaques(
        fmv([
          ...mv(home.combos),
          ...mv(home.tamanhos),
          ...mv(home.bebidas),
          ...mv(home.lanches),
        ]),
        maxDestaques,
        {
          pizza: 2,
          bebida: 1,
          lanche: 1,
          combo: 4,
        }
      );

  // const destaques = home
  //   ? (() => {
  //       const combos = destCombos(4);
  //       const tamanhos = destTams(2);
  //       const bebidas = fmv(
  //         home.bebidas.filter((x) => {
  //           return (
  //             !x.somenteEmCombos &&
  //             !!x.emCondicoes &&
  //             !!x.disponivel &&
  //             !!x.visivel &&
  //             x.estoque !== 0
  //           );
  //         }),
  //         1
  //       );

  //       const lanches = fmv(
  //         home.lanches.filter(
  //           (x) =>
  //             !x.somenteEmCombos &&
  //             x.emCondicoes &&
  //             x.disponivel &&
  //             x.visivel &&
  //             x.estoque !== 0
  //         ),
  //         1
  //       );

  //       const itens = [...combos, ...tamanhos, ...bebidas, ...lanches];

  //       if (itens.length < maxDestaques) {
  //         const diff = maxDestaques - itens.length;

  //         const tams = destTams(maxDestaques);
  //         const coms = destCombos(maxDestaques);

  //         itens.push(...fmv([...coms, ...tams], diff));
  //       }

  //       return fmv(itens, maxDestaques);
  //     })()
  //   : [];

  if (carregandoHome) return <Loading />;
  if (!home)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <TextContainer title="Erro ao carregar os dados" />
      </div>
    );

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
