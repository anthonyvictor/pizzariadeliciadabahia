import { IPedido, IPagamentoTipo, IEndereco } from "tpdb-lib";
import { IRegra } from "tpdb-lib";
import {
  entreDatas,
  entreDias,
  entrePeriodosDatas,
  entreHorarios,
  entrePeriodosDias,
  ehNiver,
  dateDiff,
} from "./date";
import { entreEnderecos } from "./enderecos/regras";
import { obterValoresDoPedido } from "./pedidos";
import { formatPhoneNumber } from "react-phone-number-input";
import { pedidoAtendeRegraProduto } from "./produtos/regras";

type StatusRegra = { v: boolean; r?: IRegra["tipo"]; f?: string; m?: string };

export const analisarRegras = ({
  item,
  para,
  pedido,
  ignorar,
}: {
  item: {
    id?: string;
    condicoes?: IRegra[];
    excecoes?: IRegra[];
  };
  pedido: IPedido;
  para?:
    | { tipo: "endereco"; enderecoOriginal: IEndereco }
    | { tipo: "metodo_pagamento"; metodo: IPagamentoTipo };

  ignorar?: IRegra["tipo"][];
}): StatusRegra => {
  const { condicoes, excecoes } = item;

  const regras: (IRegra & { as: "condicao" | "excecao" })[] = [
    ...(condicoes ?? []).map((x) => ({ ...x, as: "condicao" as "condicao" })),
    ...(excecoes ?? []).map((x) => ({ ...x, as: "excecao" as "excecao" })),
  ].filter(
    (x) =>
      x.ativa &&
      (x.validaAte ? hoje.getTime() < x.validaAte.getTime() : true) &&
      !(ignorar ?? []).includes(x.tipo)
  );

  const hoje = new Date();

  // TEMPO
  let condicoesDatas: { r: IRegra["tipo"]; v: boolean }[] = [];
  for (const regra of regras) {
    if (regra.tipo === "periodos_horarios" && regra.valor.length) {
      if (!entreHorarios(hoje, regra.valor)) {
        return { v: false, r: "periodos_horarios" };
      } else if (regra.as === "excecao") {
        return { v: false, r: "periodos_horarios" };
      }
    }

    if (regra.tipo === "datas" && regra.valor.length) {
      if (!entreDatas(hoje, regra.valor)) {
        condicoesDatas.push({ r: "datas", v: false });
      } else {
        if (regra.as === "excecao") return { v: false, r: "datas" };
        condicoesDatas.push({ r: "datas", v: true });
      }
    } else if (regra.tipo === "dias" && regra.valor.length) {
      if (!entreDias(hoje, regra.valor)) {
        condicoesDatas.push({ r: "dias", v: false });
      } else {
        if (regra.as === "excecao") return { v: false, r: "dias" };
        condicoesDatas.push({ r: "dias", v: true });
      }
    } else if (regra.tipo === "periodos_dias" && regra.valor.length) {
      if (!entrePeriodosDias(hoje, regra.valor)) {
        condicoesDatas.push({ r: "periodos_dias", v: false });
      } else {
        if (regra.as === "excecao") return { v: false, r: "periodos_dias" };
        condicoesDatas.push({ r: "periodos_dias", v: true });
      }
    } else if (regra.tipo === "periodos_datas" && regra.valor.length) {
      if (!entrePeriodosDatas(hoje, regra.valor)) {
        condicoesDatas.push({ r: "periodos_datas", v: false });
      } else {
        if (regra.as === "excecao") return { v: false, r: "periodos_datas" };
        condicoesDatas.push({ r: "periodos_datas", v: true });
      }
    }
  }

  if (condicoesDatas.length && condicoesDatas.every((x) => x.v === false))
    return condicoesDatas[0];

  // ------------------------------------------------------------------------------
  //
  // CLIENTE
  for (const regra of regras) {
    if (!pedido?.cliente) break;
    if (regra.tipo === "min_pontos_cliente") {
      if (pedido.cliente.pontos < regra.valor) {
        return { v: false, r: "min_pontos_cliente" };
      } else if (regra.as === "excecao") {
        return { v: false, r: "min_pontos_cliente" };
      }
    } else if (regra.tipo === "aniversariante") {
      if (!ehNiver(pedido.cliente.dataNasc)) {
        return { v: !regra.valor, r: "aniversariante" };
      } else {
        if (regra.as === "excecao")
          return { v: !regra.valor, r: "aniversariante" };
      }
    } else if (regra.tipo === "min_dias_de_cadastro") {
      if (dateDiff(hoje, pedido.cliente.criadoEm, "days") < regra.valor) {
        return { v: false, r: "min_dias_de_cadastro" };
      } else if (regra.as === "excecao") {
        return { v: false, r: "min_dias_de_cadastro" };
      }
    } else if (regra.tipo === "whatsapp") {
      const f = (x) => formatPhoneNumber(x).replace(/\D/g, "").slice(-8);
      const contatos = [
        pedido.cliente.whatsapp,
        ...(pedido.cliente.contatosExtras ?? []),
      ].map((x) => f(x));
      if (contatos.every((x) => x !== f(regra.valor))) {
        return { v: false, r: "whatsapp" };
      } else if (regra.as === "excecao") {
        return { v: false, r: "whatsapp" };
      }
    }
  }
  // ------------------------------------------------------------------------------
  //
  // ENDEREÇO
  const enderecoOriginal =
    para?.tipo === "endereco"
      ? para.enderecoOriginal
      : pedido?.endereco?.enderecoOriginal;

  if (pedido?.tipo === "entrega" && enderecoOriginal) {
    if (
      !enderecoOriginal?.cep ||
      !enderecoOriginal?.bairro ||
      !enderecoOriginal?.rua ||
      !enderecoOriginal?.distancia_metros
    )
      return { v: false };

    let condicoesEnderecos = [];

    for (const regra of regras.filter((x) => x.ativa)) {
      if (regra.tipo === "enderecos_horarios") {
        regra.valor.forEach((x) => {
          if (!entreHorarios(hoje, [x.horario])) return true;
          x.enderecos.forEach((e) => {
            if (!entreEnderecos(enderecoOriginal, e)) {
              condicoesEnderecos.push(false);
            } else {
              if (regra.as === "excecao") return false;
              condicoesEnderecos.push(true);
            }
          });
        });
      }
    }

    if (
      condicoesEnderecos.length &&
      condicoesEnderecos.every((x) => x === false)
    )
      return condicoesEnderecos[0];

    condicoesEnderecos = [];

    for (const regra of regras) {
      if (regra.tipo === "enderecos") {
        regra.valor.forEach((x) => {
          if (!entreEnderecos(enderecoOriginal, x)) {
            condicoesEnderecos.push(false);
          } else {
            if (regra.as === "excecao") return false;
          }
        });
      } else if (regra.tipo === "max_distancia") {
        if (enderecoOriginal.distancia_metros > regra.valor) {
          return { v: false, r: "max_distancia" };
        } else if (regra.as === "excecao") {
          return { v: false, r: "max_distancia" };
        }
      } else if (regra.tipo === "min_distancia") {
        if (enderecoOriginal.distancia_metros < regra.valor) {
          return { v: false, r: "min_distancia" };
        } else if (regra.as === "excecao") {
          return { v: false, r: "min_distancia" };
        }
      }
    }
    if (
      condicoesEnderecos.length &&
      condicoesEnderecos.every((x) => x === false)
    )
      return condicoesEnderecos[0];
  }
  // ------------------------------------------------------------------------------
  //
  // PEDIDO
  if (pedido) {
    const { valorItensComDesconto, valorTotalComDescontos, valorPagamentos } =
      obterValoresDoPedido(pedido);
    for (const regra of regras) {
      if (regra.tipo === "min_valor_pedido") {
        if (valorItensComDesconto < regra.valor) {
          return { v: false, r: "min_valor_pedido" };
        } else if (regra.as === "excecao") {
          return { v: false, r: "min_valor_pedido" };
        }
      } else if (regra.tipo === "max_valor_pedido") {
        if (valorItensComDesconto > regra.valor) {
          return { v: false, r: "max_valor_pedido" };
        } else if (regra.as === "excecao") {
          return { v: false, r: "max_valor_pedido" };
        }
      } else if (regra.tipo === "codigo_cupom") {
        if (pedido?.codigoCupom !== regra.valor) {
          return { v: false, r: "codigo_cupom" };
        } else if (regra.as === "excecao") {
          return { v: false, r: "codigo_cupom" };
        }
      } else if (regra.tipo === "tem_combo") {
        if (!pedido.itens.some((x) => x.comboId)) {
          return { v: !regra.valor, r: "tem_combo" };
        } else {
          if (regra.as === "excecao")
            return { v: !regra.valor, r: "tem_combo" };
        }
      } else if (regra.tipo === "tem_desconto") {
        if (
          !pedido.itens.some((x) => x.desconto) &&
          !pedido?.endereco?.desconto
        ) {
          return { v: !regra.valor, r: "tem_desconto" };
        } else {
          if (regra.as === "excecao")
            return { v: !regra.valor, r: "tem_desconto" };
        }
      } else if (regra.tipo === "tipo") {
        if (pedido.tipo !== regra.valor) {
          return { v: false, r: "tipo" };
        } else if (regra.as === "excecao") {
          return { v: false, r: "tipo" };
        }
      } else if (regra.tipo === "produtos") {
        for (const regraProduto of regra.valor) {
          const valido = pedidoAtendeRegraProduto(pedido.itens, regraProduto);
          if (!valido) return { v: false, r: "produtos" };
          if (regra.as === "excecao") return { v: false, r: "produtos" };
        }
      } else if (regra.tipo === "metodo_pagamento") {
        const valorPagoNoMetodo = pedido.pagamentos
          .filter((x) => (regra.valor as IPagamentoTipo[]).includes(x.tipo))
          .reduce((acc, curr) => acc + curr.valor, 0);
        if (
          valorPagamentos.total.total > 0 &&
          valorTotalComDescontos > valorPagoNoMetodo
        ) {
          return { v: false, r: "metodo_pagamento" };
        } else if (regra.as === "excecao") {
          return { v: false, r: "metodo_pagamento" };
        }
      }
    }
  }

  return {
    v: true,
  };
};
