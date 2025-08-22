import { ICliente } from "tpdb-lib";
import { IPagamentoPedidoPix, IPedido } from "tpdb-lib";
import { lerCookie, parseCookies, salvarCookie } from "./api";
import { obterCliente } from "@routes/clientes";
import { novoPedido, obterPedido } from "@routes/pedidos";
import { GetServerSidePropsContext } from "next";

export const verificarClienteEPedido = async (
  ctx: GetServerSidePropsContext,
  opcoes?: { comEnderecoCompleto?: boolean; verificarPixAguardando?: boolean }
): Promise<
  | {
      redirect: {
        destination: string;
        permanent: boolean;
      };
    }
  | {
      props: {
        cliente: ICliente;
        pedido: IPedido;
        pix?: IPagamentoPedidoPix | null;
      };
    }
> => {
  //   return { props: { cliente: null, pedido: null } };

  const cookies = parseCookies(ctx.req);

  const clienteId = lerCookie(cookies.clienteId);
  const pedidoId = lerCookie(cookies.pedidoId);

  const cliente = clienteId
    ? await obterCliente(clienteId, opcoes?.comEnderecoCompleto)
    : null;

  if (!cliente && ctx.resolvedUrl !== "/cliente/informacoes-iniciais") {
    return {
      redirect: {
        destination: "/cliente/informacoes-iniciais",
        permanent: false,
      },
    };
  }

  let pedido: IPedido | null = null;

  if (pedidoId) pedido = await obterPedido(pedidoId);

  if (!pedido || pedido.cliente.id !== cliente.id) {
    pedido = await novoPedido(clienteId);
    salvarCookie("pedidoId", pedido.id, ctx.res, 60 * 60 * 24 * 1); // expira em 1 dia
    if (ctx.resolvedUrl !== "/pedido")
      return {
        redirect: {
          destination: "/pedido",
          permanent: false,
        },
      };
  }

  if (
    !pedido.itens?.length &&
    ["/pag", "/tipo", "/conf"].some((x) =>
      ctx.resolvedUrl.startsWith("/pedido" + x)
    )
  ) {
    return {
      redirect: {
        destination: "/pedido",
        permanent: false,
      },
    };
  }

  let pix = null;
  if (opcoes?.verificarPixAguardando) {
    pix =
      pedido.pagamentos.find(
        (x) => x.tipo === "pix" && x.status === "aguardando" && x.qrcode
      ) || null;
    if (pix && ctx.resolvedUrl !== "/pedido/pagamento/pix") {
      return {
        redirect: {
          destination: "/pedido/pagamento/pix",
          permanent: false,
        },
      };
    }
  }

  return {
    props: { cliente, pedido, pix: pix as IPagamentoPedidoPix | null },
  };
};
