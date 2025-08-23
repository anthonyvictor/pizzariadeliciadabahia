import { GetServerSideProps, NextPage } from "next";
import { BairroView } from "src/views/cliente/novoEndereco/bairro";
import { env } from "@config/env";
import { useEffect, useState } from "react";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import { ICookies } from "@models/cookies";
import axios from "axios";
import { toast } from "react-toastify";
import { obterCookies } from "@util/cookies";

const BairroPage: NextPage = ({ clienteId, pedidoId }: ICookies) => {
  const [bairros, setBairros] = useState([]);
  const { temClientePedido, authCarregado } = useAuth();

  useEffect(() => {
    temClientePedido(clienteId, pedidoId);
  }, []);

  useEffect(() => {
    if (authCarregado) {
      axios
        .get(`${env.apiURL}/bairros`)
        .then((res) => {
          setBairros(res.data);
        })
        .catch((err) => {
          toast.error("Erro ao carregar dados");
          console.error(err);
        });
    }
  }, [authCarregado]);

  if (!authCarregado || !bairros) return <Loading />;

  return <BairroView bairros={bairros} />;
};

export default BairroPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { clienteId, pedidoId } = obterCookies(ctx);
  return {
    props: {
      clienteId,
      pedidoId,
    },
  };
};
