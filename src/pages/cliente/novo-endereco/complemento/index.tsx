import Loading from "@components/loading";
import { env } from "@config/env";
import { analisarCodigoCupom } from "@util/cupons";
import { useAuth } from "@util/hooks/auth";
import axios from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ComplementoView } from "src/views/cliente/novoEndereco/complemento";
import { ICupom } from "tpdb-lib";

const ComplementoPage: NextPage = () => {
  const [cupom, setCupom] = useState<ICupom>();
  const [carregouCupom, setCarregouCupom] = useState(false);

  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(`${env.apiURL}/cupons?clienteId=${pedido.cliente.id}`)
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

  return <ComplementoView cupom={cupom} />;
};

export default ComplementoPage;
