import { env } from "@config/env";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { ICliente, IPagamentoPedidoPix, IPedido } from "tpdb-lib";

const pages = {
  infoIniciais: "/cliente/informacoes-iniciais",
  finalizado: "/pedido/finalizado",
  pedido: "/pedido",
};

export const useAuth = () => {
  const router = useRouter();

  const [fechado, setFechado] = useState(true);
  const [authCarregado, setAuthCarregado] = useState(false);
  const [cliente, setCliente] = useState<ICliente>();
  const [pedido, setPedido] = useState<IPedido>();
  const [pixAguardando, setPixAguardando] = useState<IPagamentoPedidoPix>();

  const temClientePedido = async (
    opcoes: {
      verificarPixAguardando?: boolean;
    } = {
      verificarPixAguardando: true,
    }
  ) => {
    const clienteId = localStorage.getItem("clienteId");
    const pedidoId = localStorage.getItem("pedidoId");

    const obterCliente = async () => {
      if (!clienteId) return null;
      const res = await axios.get(`${env.apiURL}/clientes?id=${clienteId}`);
      return res.data as ICliente;
    };

    const _cliente = await obterCliente();

    if (!_cliente && router.pathname !== pages.infoIniciais)
      return router.push(pages.infoIniciais);

    setCliente(_cliente);

    const obterPedido = async (peloCliente?: boolean) => {
      try {
        if (!pedidoId) return null;
        const res = await axios.get(
          `${env.apiURL}/pedidos?${
            peloCliente
              ? `clientesIds=${_cliente.id}&status=emAndamento`
              : `id=${pedidoId}`
          }`
        );
        const ped = (
          Array.isArray(res.data) ? res.data[0] : res.data
        ) as IPedido;
        if (!ped?.id)
          throw new Error("Oops, não foi possível obter o pedido atual!");
        localStorage.setItem("pedidoId", ped.id);
        return ped;
      } catch (err) {
        console.error(err);
      }
    };

    const novoPedido = async () => {
      try {
        const res = await axios.post(`${env.apiURL}/pedidos`, { clienteId });
        const ped = res.data as IPedido;
        if (!ped?.id)
          throw new Error("Oops, não foi possível iniciar um novo pedido!");
        localStorage.setItem("pedidoId", ped.id);
        return ped;
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };

    let _pedido = await obterPedido();

    if (!_pedido) _pedido = await obterPedido(true);

    if (!_pedido || _pedido.cliente?.id !== _cliente.id) {
      _pedido = await novoPedido();
      if (router.pathname !== pages.pedido) return router.push(pages.pedido);
    }

    if (!!_pedido?.enviadoEm && router.pathname !== pages.finalizado) {
      _pedido = await novoPedido();
      if (router.pathname !== pages.pedido) return router.push(pages.pedido);
    }

    setPedido(_pedido);

    if (
      !_pedido.itens?.length &&
      !(
        router.pathname.startsWith("/pedido/ite") ||
        router.pathname === pages.pedido
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
    fechado,
  };
};
