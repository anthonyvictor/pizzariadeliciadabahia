import { env } from "@config/env";
import { analisarRegrasTempo } from "@util/regras";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useClienteStore } from "src/infra/zustand/cliente";
import { usePedidoStore } from "src/infra/zustand/pedido";
import {
  ICliente,
  IPagamentoPedidoPix,
  IPedido,
  IConfig,
  IConfigHorarioFuncionamento,
} from "tpdb-lib";

const pages = {
  infoIniciais: "/cliente/informacoes-iniciais",
  finalizado: "/pedido/finalizado",
  pedido: "/pedido",
  fechado: "/fechado",
};

export const useAuth = (
  opcoes: { verificarPixAguardando?: boolean } = {
    verificarPixAguardando: true,
  }
) => {
  const router = useRouter();

  const [authCarregado, setAuthCarregado] = useState(false);
  // const [cliente, setCliente] = useState<ICliente>();
  // const [pedido, setPedido] = useState<IPedido>();
  const [aberto, setAberto] = useState(true);
  const [configs, setConfigs] = useState<IConfig[]>([]);
  const { setCliente } = useClienteStore();
  const { setPedido } = usePedidoStore();
  const [pixAguardando, setPixAguardando] = useState<IPagamentoPedidoPix>();

  useEffect(() => {
    temClientePedido();
  }, []);

  const temClientePedido = async () => {
    if (router.pathname === pages.finalizado) {
      setAuthCarregado(true);
      return;
    }

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

    const obterConfigs = async () => {
      if (!clienteId) return null;
      const res = await axios.get(`${env.apiURL}/configs`);
      return res.data as IConfig[];
    };
    const _configs = await obterConfigs();
    const configHorarioFunc = _configs.find(
      (x) => x.chave === "horario_funcionamento"
    )?.valor as IConfigHorarioFuncionamento;

    const getAberto = () => {
      if (!configHorarioFunc) return true;

      if (
        configHorarioFunc.fechadoAte &&
        new Date(configHorarioFunc.fechadoAte).getTime() > new Date().getTime()
      )
        return false;

      const pelasRegrasTempo = analisarRegrasTempo(configHorarioFunc);

      if (pelasRegrasTempo) return true;

      const peloLiberadoAte =
        !!configHorarioFunc.liberadoAte &&
        new Date(configHorarioFunc.liberadoAte).getTime() >=
          new Date().getTime();

      return peloLiberadoAte;
    };

    const _aberto = getAberto();
    setAberto(_aberto);
    if (!_aberto) {
      const subpage = router.pathname.replace(pages.pedido, "");
      if (
        router.pathname.startsWith(pages.pedido) &&
        !(subpage.startsWith("/item") || subpage === "" || subpage === "/")
      )
        return router.replace(pages.pedido);
    }

    setConfigs(_configs);

    const obterPedido = async (peloCliente?: boolean) => {
      try {
        if ((peloCliente && !_cliente.id) || (!peloCliente && !pedidoId))
          return null;
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
    authCarregado,
    pixAguardando,
    configs,
    aberto,
  };
};
