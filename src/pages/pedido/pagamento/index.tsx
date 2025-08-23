import { GetServerSideProps, NextPage } from "next";
import { PagamentoView } from "src/views/pedido/pagamento";
import { ICupom } from "tpdb-lib";
import { analisarCodigoCupom } from "@util/cupons";
import { obterCookies } from "@util/cookies";
import { ICookies } from "@models/cookies";
import { useEffect, useState } from "react";
import { useAuth } from "@util/hooks/auth";
import axios from "axios";
import { env } from "@config/env";
import { toast } from "react-toastify";
import Loading from "@components/loading";

const PagamentoPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const [cupom, setCupom] = useState<ICupom>();
  const [carregouCupom, setCarregouCupom] = useState(false);

  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(`${env.apiURL}/cupons?clienteId=${clienteId}`)
        .then((res) => {
          if (!res.data || !Array.isArray(res.data) || !res.data.length) return;

          const b = res.data.filter(
            (cupom) => cupom.alvo === "pagamento" || cupom.alvo === "itens"
          );
          const c = b.filter((cupom) =>
            analisarCodigoCupom(cupom, pedido.codigoCupom)
          );
          const d = c.sort((a, b) =>
            a.condicoes.some((x) => x.tipo === "codigo") ? -1 : 1
          );

          setCupom(d?.[0]);
        })
        .catch((err) => {
          toast.error("Erro ao carregar dados");
          console.error(err);
        })
        .finally(() => {
          setCarregouCupom(true);
        });
    }
  }, [authCarregado]);

  if (!authCarregado || !carregouCupom) return <Loading />;

  return <PagamentoView pedido={pedido} cupomPagamento={cupom} />;
};

export default PagamentoPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
