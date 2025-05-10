import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IPizzaTamanho } from "@models/pizza";
import { Promo } from "@models/promo";
import { env } from "@config/env";
import { IItem, IPizza } from "@models/item";
import { removeAccents } from "@util/format";
import moment from "moment";

const PromoContext = createContext<{
  getTaxaGratis: (itens: IItem[]) => boolean;
  getTaxaGratis36: (itens: IItem[]) => boolean;
  getBordaGratis: (tamanho: IPizzaTamanho) => boolean;
  getDuasRefri60: () => boolean;
  getGrande29: () => boolean;
  getGFRefri: (tamanho: IPizzaTamanho) => boolean;
  getKids: () => boolean;
  pequenaPromo: () => boolean;
  duasPequenas: () => boolean;
  promosCarregadas: boolean;
  grandeOuFamilia: "grande" | "familia" | "ambas";
}>(null);

const PromoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [promosCarregadas, setPromosCarregadas] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const promosFromBackend = (await (
          await fetch(`${env.apiURL}/promo`, {
            headers: { "Content-Type": "application/json" },
          })
        ).json()) as Promo[];
        setPromos(promosFromBackend);
        setPromosCarregadas(true);
      } catch (err) {
        console.error((err as Error).message, (err as Error).stack);
      }
    })();
  }, []);
  function isValidDate(date) {
    return (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    );
  }
  const getEhDia = (promo: Promo) => {
    return promo.dias.some((x) => {
      const hoje = new Date();
      const _x = moment(x);
      hoje.setHours(16, 0, 0, 0);

      const p = removeAccents(
        hoje.toLocaleDateString("pt-BR", { weekday: "long" }).toLowerCase()
      );

      let r = false;

      if (_x.isValid()) {
        const _y = _x.toDate();
        _y.setHours(16, 0, 0, 0);
        r = hoje.toString() === _y.toString();
      } else {
        r = p.includes(removeAccents((x as string).toLowerCase()));
      }

      return r;
    });
  };

  const getTaxaGratis = (itens: IItem[]) => {
    if (getDuasRefri60()) return false;
    const promo = promos.find((x) => x.nome.includes("taxa-gratis"));
    if (!promo || !promo.ativa) return false;
    if (!getEhDia(promo)) return false;

    const pizzas = itens.filter((x) => x.tipo === "pizza") as IPizza[];
    const CONDICAO =
      pizzas.length > 0 &&
      pizzas.some((x) => x.tamanho.valorMin >= 27 && x.tamanho.fatias >= 8);

    return CONDICAO;
  };
  const getTaxaGratis36 = (itens: IItem[]) => {
    const promo = promos.find((x) => x.nome.includes("taxa-gratis-36"));
    if (!promo || !promo.ativa) return false;
    if (!getEhDia(promo)) return false;

    const pizzas = itens.filter((x) => x.tipo === "pizza") as IPizza[];
    const CONDICAO =
      pizzas.length > 0 &&
      pizzas.some((x) => x.tamanho.valorMin >= 36 && x.tamanho.fatias >= 8);

    return CONDICAO;
  };

  const getBordaGratis = (tamanho: IPizzaTamanho) => {
    // if (getDuasRefri60()) return false;
    const promo = promos.find((x) => x.nome.includes("borda-gratis"));
    if (!promo || !promo.ativa) return false;
    if (!getEhDia(promo)) return false;
    const CONDICAO = tamanho.valorMin >= 36 && tamanho.fatias >= 8;
    return CONDICAO;
  };
  const grandeOuFamilia: "grande" | "ambas" | "familia" = "grande";
  const getDuasRefri60 = () => {
    const promo = promos.find((x) => x.nome.includes("duas-refri-60"));
    if (!promo || !promo.ativa) return false;
    const ehDia = getEhDia(promo);
    if (!ehDia) return false;

    const CONDICAO = true;
    return CONDICAO;
  };
  const pequenaPromo = () => {
    const promo = promos.find((x) => x.nome.includes("pequena-promocional"));
    if (!promo || !promo.ativa) return false;
    const ehDia = getEhDia(promo);
    if (!ehDia) return false;

    const CONDICAO = true;
    return CONDICAO;
  };
  const duasPequenas = () => {
    const promo = promos.find((x) => x.nome.includes("duas-pequenas"));
    if (!promo || !promo.ativa) return false;
    const ehDia = getEhDia(promo);
    if (!ehDia) return false;

    const CONDICAO = true;
    return CONDICAO;
  };
  const getGrande29 = () => {
    const promo = promos.find((x) => x.nome.includes("grande-2999"));
    if (!promo || !promo.ativa) return false;
    const ehDia = getEhDia(promo);
    if (!ehDia) return false;

    const CONDICAO = true;
    return CONDICAO;
  };

  const getGFRefri = (tamanho: IPizzaTamanho) => {
    const promo = promos.find((x) => x.nome.includes("gf-refri"));
    console.log(promo, "aaaaaaaaaaaaaaaaaaaaa");
    if (!promo || !promo.ativa) return false;
    const ehDia = getEhDia(promo);
    if (!ehDia) return false;

    const CONDICAO = tamanho.valorMin >= 36 && tamanho.fatias >= 8;
    return CONDICAO;
  };

  const getKids = () => {
    const promo = promos.find((x) => x.nome.includes("kids"));

    if (!promo || !promo.ativa) return false;

    const CONDICAO = true;
    return CONDICAO;
  };

  //   const a:Omit<Promo, 'id'>[] = [
  //     {"nome": "taxa-gratis", "ativa": true, "dias":  ["terça", "tuesday", "quarta", "wednesday"]},
  //     {"nome": "borda-gratis", "ativa": true, "dias": ["quinta", "thursday", "sexta", "friday"] },
  //     {"nome": "duas-refri-60", "ativa": true, "dias":  ["sábado", "saturday", "domingo", "sunday"] },
  //   ]

  return (
    <PromoContext.Provider
      value={{
        getTaxaGratis,
        getBordaGratis,
        grandeOuFamilia,
        getDuasRefri60,
        getGFRefri,
        getKids,
        getTaxaGratis36,
        getGrande29,
        pequenaPromo,
        duasPequenas,
        promosCarregadas,
      }}
    >
      {children}
    </PromoContext.Provider>
  );
};
export default PromoProvider;

export const usePromo = () => {
  return useContext(PromoContext);
};
