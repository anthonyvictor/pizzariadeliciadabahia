import { env } from "@config/env";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { ICliente, IPagamentoPedidoPix, IPedido } from "tpdb-lib";

export const useAuth = () => {
  const router = useRouter();

  const [authCarregado, setAuthCarregado] = useState(false);
  const [cliente, setCliente] = useState<ICliente>();
  const [pedido, setPedido] = useState<IPedido>();
  const [pixAguardando, setPixAguardando] = useState<IPagamentoPedidoPix>();
  const temClientePedido = async (
    clienteId: string | null,
    pedidoId: string | null,
    opcoes: {
      comEnderecoCompleto?: boolean;
      verificarPixAguardando?: boolean;
    } = {
      comEnderecoCompleto: false,
      verificarPixAguardando: true,
    }
  ) => {
    const obterCliente = async () => {
      if (!clienteId) return null;
      const res = await axios.get(
        `${env.apiURL}/clientes?id=${clienteId}&comEnderecoCompleto=${opcoes.comEnderecoCompleto}`
      );
      return res.data as ICliente;
    };

    const _cliente = await obterCliente();

    if (!_cliente && router.pathname !== "/cliente/informacoes-iniciais")
      return router.push("/cliente/informacoes-iniciais");

    setCliente(_cliente);

    const obterPedido = async () => {
      if (!pedidoId) return null;
      const res = await axios.get(
        `${env.apiURL}/pedidos?id=${pedidoId}&comEnderecoCompleto=${opcoes?.comEnderecoCompleto}`
      );
      return res.data as IPedido;
    };

    const novoPedido = async () => {
      const res = await axios.post(`${env.apiURL}/pedidos`, { clienteId });
      return res.data as IPedido;
    };

    let _pedido = await obterPedido();

    if (!!_pedido.enviadoEm && router.pathname !== "/pedido/finalizado") {
      _pedido = await novoPedido();
      return router.push("/pedido").then(() => {
        router.reload();
      });
    }

    if (!_pedido || _pedido.cliente?.id !== _cliente.id) {
      _pedido = await novoPedido();
      if (router.pathname !== "/pedido") return;
      router.push("/pedido").then(() => {
        router.reload();
      });
    }

    setPedido(_pedido);

    if (
      !_pedido.itens?.length &&
      ["/pag", "/tipo", "/conf", "/fin"].some((x) =>
        router.pathname.startsWith("/pedido" + x)
      )
    )
      return router.push("/pedido");

    let pix = null;
    if (opcoes.verificarPixAguardando) {
      const pags = _pedido.pagamentos ?? [];

      pix = pags.find(
        (x) => x.tipo === "pix" && x.status === "aguardando" && x.qrcode
      );

      if (pix && router.pathname !== "/pedido/pagamento/pix")
        return router.push("/pedido/pagamento/pix");

      setPixAguardando(pix);
    }

    setAuthCarregado(true);
  };

  return {
    temClientePedido,
    authCarregado,
    cliente,
    pedido,
    pixAguardando,
  };
};
