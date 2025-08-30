import { ICupom } from "tpdb-lib";
import { analisarCodigoCupom } from "@util/cupons";
import { NextPage } from "next";
import { TipoView } from "src/views/pedido/tipo";
import { useEffect, useState } from "react";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import { toast } from "react-toastify";
import axios from "axios";
import { env } from "@config/env";
import { TipoPageProvider } from "src/views/pedido/tipo/context";

const TipoPage: NextPage = () => {
  const [cupom, setCupom] = useState<ICupom>();
  const [carregouCupom, setCarregouCupom] = useState(false);

  const { temClientePedido, authCarregado, pedido } = useAuth();

  useEffect(() => {
    temClientePedido({
      verificarPixAguardando: true,
    });
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

  useEffect(() => {
    console.log("authCarregado", authCarregado);
    console.log("carregouCupom", carregouCupom);
  }, [authCarregado, carregouCupom]);

  if (!authCarregado || !carregouCupom || !pedido) return <Loading />;

  return (
    <TipoPageProvider pedido={pedido} cupomEntrega={cupom}>
      <TipoView />
    </TipoPageProvider>
  );
};

export default TipoPage;
