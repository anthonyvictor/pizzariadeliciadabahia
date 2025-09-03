import Loading from "@components/loading";
import { useAuth } from "@util/hooks/auth";
import { NextPage } from "next";
import { useEffect } from "react";

import { FechadoView } from "src/views/fechado";

const FechadoPage: NextPage = () => {
  const { temClientePedido, authCarregado, configs } = useAuth();

  useEffect(() => {
    temClientePedido();
  }, []);

  if (!authCarregado) return <Loading />;

  return <FechadoView configs={configs} />;
};

export default FechadoPage;
