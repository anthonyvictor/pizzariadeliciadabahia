import Loading from "@components/loading";
import { useAuth } from "@util/hooks/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ComplementoView } from "src/views/cliente/novoEndereco/complemento";
import { IEnderecoCliente } from "tpdb-lib";

const ComplementoPage: NextPage = () => {
  // const [cupom, setCupom] = useState<ICupom>();
  // const [carregouCupom, setCarregouCupom] = useState(false);

  const { temClientePedido, authCarregado } = useAuth();
  const router = useRouter();

  useEffect(() => {
    temClientePedido();
  }, []);

  const [carregandoEndereco, setCarregandoEndereco] = useState(true);
  // const [descontoReal, setDescontoReal] = useState<number>(0);
  const [endereco, setEndereco] = useState<IEnderecoCliente | null>(null);

  useEffect(() => {
    const _endereco = JSON.parse(
      sessionStorage.getItem("endereco") ?? "{}"
    ) as IEnderecoCliente;

    setEndereco(_endereco);
    if (!_endereco?.enderecoOriginal?.cep) {
      router.back();
    } else {
      setCarregandoEndereco(false);
    }
  }, []);

  // } else {
  //   axios
  //     .post(`${env.apiURL}/enderecos/completo`, {
  //       endereco: _endereco,
  //     })
  //     .then((res) => {
  //       const enderecoCompleto = res.data;
  //       setEndereco(enderecoCompleto);

  //       // if (cupomAplicavel(cupom, enderecoCompleto)) {
  //       //   const _descontoReal = obterValorDescontoReal(
  //       //     enderecoCompleto.taxa ?? 0,
  //       //     cupom.valor,
  //       //     cupom.tipo,
  //       //     cupom.maxDesconto
  //       //   );

  //       //   setDescontoReal(_descontoReal);
  //       // }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Não foi possível obter a taxa de entrega");
  //       setEndereco(_endereco);
  //       setLoading(false);
  //     });

  // useEffect(() => {s
  //   if (authCarregado) {
  //     axios
  //       .get(`${env.apiURL}/cupons?clienteId=${pedido.cliente.id}`)
  //       .then((res) => {
  //         if (!res.data || !Array.isArray(res.data) || !res.data.length) return;

  //         const b = res.data.filter((cupom) => cupom.alvo === "entrega");
  //         const c = b.filter((cupom) =>
  //           analisarCodigoCupom(cupom, pedido.codigoCupom)
  //         );
  //         const d = c.sort((a, b) =>
  //           a.condicoes.some((x) => x.tipo === "codigo") ? -1 : 1
  //         );

  //         setCupom(d?.[0]);
  //       })
  //       .catch((err) => {
  //         toast.error("Erro ao carregar dados");
  //         console.error(err);
  //       })
  //       .finally(() => {
  //         setCarregouCupom(true);
  //       });
  //   }
  // }, [authCarregado]);

  if (!authCarregado || carregandoEndereco || !endereco) return <Loading />;

  if (!!endereco) return <ComplementoView endereco={endereco} />;

  return <></>;
};

export default ComplementoPage;
