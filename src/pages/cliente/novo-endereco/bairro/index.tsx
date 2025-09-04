import { NextPage } from "next";
import { BairroView } from "src/views/cliente/novoEndereco/bairro";
import { env } from "@config/env";
import { useEffect, useState } from "react";
import { useAuth } from "@util/hooks/auth";
import Loading from "@components/loading";
import axios from "axios";
import { toast } from "react-toastify";

const BairroPage: NextPage = () => {
  const [bairros, setBairros] = useState([]);
  const { authCarregado } = useAuth();

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

  if (!authCarregado || !bairros?.length) return <Loading />;

  return <BairroView bairros={bairros} />;
};

export default BairroPage;
