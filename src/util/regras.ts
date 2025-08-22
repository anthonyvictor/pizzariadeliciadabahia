import {
  IPizzaSabor,
  IPizzaTamanho,
  ICombo,
  IBebida,
  ILanche,
  IProdutoBase,
  IProdutoComboPizza,
  IProdutoComboBebida,
  IProdutoComboLanche,
} from "tpdb-lib";
import { ICliente } from "tpdb-lib";
import { IRegra, IRegraProduto } from "tpdb-lib";
import {
  algumaData,
  algumDiaDaSemanaNumero,
  entreDatas,
  entreHorarios,
} from "./date";
import { IDeveEstar } from "@models/deveEstar";

export const produtoDispPelasRegras = (
  prod:
    | {
        disponivel: boolean;
        visivel: boolean;
        condicoes?: IRegra[] | undefined;
        excecoes?: IRegra[] | undefined;
        estoque?: number;
      }
    | undefined,
  cliente: ICliente,
  deveEstar: IDeveEstar = "emCondicoes"
) => {
  if (!prod) return false;
  if (deveEstar == "visivel" && !prod.visivel) return false;
  const temEstoque = estoqueDisp(prod.estoque);
  if (
    deveEstar == "disponivel" &&
    (!prod.visivel || !prod.disponivel || !temEstoque)
  )
    return false;

  if (
    deveEstar === "emCondicoes" &&
    (!prod.visivel ||
      !prod.disponivel ||
      !temEstoque ||
      !analisarRegrasBasicas(prod.condicoes, prod.excecoes, cliente))
  )
    return false;

  return true;
};

export const estoqueDisp = (estoque: undefined | null | number) => {
  if (estoque === undefined || estoque === null) return true;
  return estoque > 0;
};
export const analisarRegrasBasicas = (
  condicoes: IRegra[] | undefined,
  excecoes: IRegra[] | undefined,
  cliente: ICliente
) => {
  const hoje = new Date();
  let condicoesDatas = [];
  for (const condicao of (condicoes ?? []).filter((x) => x.ativa)) {
    if (condicao.tipo === "periodos_horarios" && condicao.valor.length) {
      if (!entreHorarios(hoje, condicao.valor)) {
        return false;
      }
    } else if (condicao.tipo === "min_pontos") {
      if (cliente.pontos < condicao.valor) return false;
    }

    if (condicao.tipo === "datas" && condicao.valor.length) {
      if (!algumaData(hoje, condicao.valor)) {
        // console.log("falhou pq nao eh data", hoje, condicao.valor);
        condicoesDatas.push(false);
      } else {
        condicoesDatas.push(true);
      }
    } else if (condicao.tipo === "dias" && condicao.valor.length) {
      if (!algumDiaDaSemanaNumero(hoje, condicao.valor)) {
        // console.log(
        //   nome,
        //   "falhou pq nao eh dia da semana",
        //   hoje,
        //   condicao.valor
        // );
        condicoesDatas.push(false);
      } else {
        condicoesDatas.push(true);
      }
    } else if (condicao.tipo === "periodos_datas" && condicao.valor.length) {
      // console.log("entrou em periodos_datas");
      if (!entreDatas(hoje, condicao.valor)) {
        // console.log("nao ta entre as datas", hoje, condicao.valor);
        condicoesDatas.push(false);
      } else {
        // console.log("ta entra as datas sim porra", hoje, condicao.valor);
        condicoesDatas.push(true);
        // console.log(
        //   "ve se ta todos false",
        //   condicoesDatas.every((x) => x === false),
        //   condicoesDatas
        // );
      }
    } else {
      condicoesDatas.push(true);
    }

    // if ((nome ?? "").includes("2G01")) {
    //   console.log(
    //     "deu false n seu pq caralhjos",
    //     condicoesDatas.every((x) => x === false),
    //     condicoesDatas
    //   );
    // }
  }
  if (condicoesDatas.length && condicoesDatas.every((x) => x === false))
    return false;

  for (const excecao of (excecoes ?? []).filter((x) => x.ativa)) {
    if (excecao.tipo === "datas" && excecao.valor.length) {
      if (algumaData(hoje, excecao.valor)) {
        // console.log("falhou pq hj é uma data exceção", hoje, excecao.valor);
        return false;
      }
    } else if (excecao.tipo === "dias" && excecao.valor.length) {
      if (algumDiaDaSemanaNumero(hoje, excecao.valor)) {
        // console.log(
        //   "falhou pq hj é um dia da semana exceção",
        //   hoje,
        //   excecao.valor
        // );
        return false;
      }
    } else if (excecao.tipo === "periodos_horarios" && excecao.valor.length) {
      if (entreHorarios(hoje, excecao.valor)) {
        // console.log("falhou pq hj é um horario exceção", hoje, excecao.valor);
        return false;
      }
    } else if (excecao.tipo === "periodos_datas" && excecao.valor.length) {
      if (entreDatas(hoje, excecao.valor)) {
        // console.log(
        //   "falhou pq hj está entre um periodo exceção",
        //   hoje,
        //   excecao.valor
        // );
        return false;
      }
    }
  }

  return true;
};

export const comboDispPelasRegras = (
  combo: ICombo,
  cliente: ICliente,
  deveEstar: "visivel" | "disponivel" | "emCondicoes" | null = "emCondicoes"
) => {
  if (!produtoDispPelasRegras(combo, cliente, deveEstar)) return false;
  const produtosDevemEstar = deveEstar === "visivel" ? null : deveEstar;

  const tamanhos = combo.produtos
    .filter((x) => x.tipo === "pizza")
    .map((x) => (x as IProdutoComboPizza).tamanho)
    .filter(
      (tamanho, index, self) =>
        index === self.findIndex((t) => t.id === tamanho.id)
    );

  if (
    tamanhos.length &&
    tamanhos.some(
      (x) => !produtoDispPelasRegras(x, cliente, produtosDevemEstar)
    )
  )
    return false;

  const sabores = combo.produtos
    .filter((x) => x.tipo === "pizza")
    .map((x) => (x as IProdutoComboPizza).sabores ?? [])
    .flat()
    .filter(
      (sabor, index, self) => index === self.findIndex((t) => t.id === sabor.id)
    );
  const saboresDisponiveis =
    sabores.length &&
    sabores.filter((x) =>
      produtoDispPelasRegras(x, cliente, produtosDevemEstar)
    );

  const bebidas = combo.produtos
    .filter((x) => x.tipo === "bebida")
    .map((x) => (x as IProdutoComboBebida).bebidas ?? [])
    .flat()
    .filter(
      (bebida, index, self) =>
        index === self.findIndex((t) => t.id === bebida.id)
    );
  const bebidasDisponiveis =
    bebidas.length &&
    bebidas.filter((x) =>
      produtoDispPelasRegras(x, cliente, produtosDevemEstar)
    );

  const lanches = combo.produtos
    .filter((x) => x.tipo === "lanche")
    .map((x) => (x as IProdutoComboLanche).lanches ?? [])
    .flat()
    .filter(
      (lanche, index, self) =>
        index === self.findIndex((t) => t.id === lanche.id)
    );
  const lanchesDisponiveis =
    lanches.length &&
    lanches.filter((x) =>
      produtoDispPelasRegras(x, cliente, produtosDevemEstar)
    );

  for (const produto of combo.produtos) {
    if (produto.tipo === "pizza") {
      if (
        saboresDisponiveis?.length &&
        produto.sabores?.length &&
        produto.sabores.every(
          (x) => !saboresDisponiveis.map((x) => x.id).includes(x.id)
        )
      )
        return false;
    } else if (produto.tipo === "bebida") {
      if (
        bebidasDisponiveis?.length &&
        produto.bebidas?.length &&
        produto.bebidas.every(
          (x) => !bebidasDisponiveis.map((x) => x.id).includes(x.id)
        )
      )
        return false;
    } else if (produto.tipo === "lanche") {
      if (
        lanchesDisponiveis?.length &&
        produto.lanches?.length &&
        produto.lanches.every(
          (x) => !lanchesDisponiveis.map((x) => x.id).includes(x.id)
        )
      )
        return false;
    }
  }
  return true;
};
