import { ICupom } from "tpdb-lib";
import { analisarCodigoCupom } from "@util/cupons";
import { GetServerSideProps, NextPage } from "next";
import { TipoView } from "src/views/pedido/tipo";
import { useEffect, useState } from "react";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import { toast } from "react-toastify";
import axios from "axios";
import { ICookies } from "@models/cookies";
import { env } from "@config/env";
import { obterCookies } from "@util/cookies";

const TipoPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const [cupom, setCupom] = useState<ICupom>();
  const [carregouCupom, setCarregouCupom] = useState(false);

  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId, {
      comEnderecoCompleto: true,
    });
  }, []);

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(`${env.apiURL}/cupons?clienteId=${clienteId}`)
        .then((res) => {
          if (!res.data || !Array.isArray(res.data) || !res.data.length) return;

          const b = res.data.filter((cupom) => cupom.alvo === "entrega");
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

  return <TipoView pedido={pedido} cupomEntrega={cupom} />;
};

export default TipoPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
