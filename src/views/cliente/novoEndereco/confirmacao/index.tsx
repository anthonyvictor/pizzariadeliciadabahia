import TextContainer from "@components/textContainer";
import { useRouter } from "next/router";
import { ConfirmacaoComplementoViewStyle } from "./styles";
import { IEnderecoCliente } from "tpdb-lib";
import { useEffect, useState } from "react";
import BottomControls from "@components/pedido/bottomControls";
import { formatCEP } from "@util/format";
import { ICliente } from "tpdb-lib";
import { env } from "@config/env";
import { toast } from "react-toastify";
import axios from "axios";
import { axiosOk } from "@util/axios";
import Loading from "@components/loading";
import { useClienteStore } from "src/infra/zustand/cliente";

export const ConfirmacaoComplementoView = () => {
  const router = useRouter();
  const [endereco, setEndereco] = useState<IEnderecoCliente>();
  const { cliente } = useClienteStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _endereco = JSON.parse(
      sessionStorage.getItem("endereco") ?? "{}"
    ) as IEnderecoCliente;
    if (!_endereco?.enderecoOriginal?.cep) {
      router.back();
    } else {
      setEndereco(_endereco);
      setLoading(false);
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <ConfirmacaoComplementoViewStyle>
      {!!endereco?.enderecoOriginal?.cep && (
        <>
          <TextContainer title="Confirma o endereço?" />

          <div className="mapa-container">
            <iframe
              title="mapa"
              id="gmap_canvas"
              // src={`https://maps.google.com/maps?q=pizzaria delicia da bahia&t=&z=18&ie=UTF8&iwloc=A&output=embed`}
              src={`https://www.google.com/maps?q=${
                endereco.enderecoOriginal.lat && endereco.enderecoOriginal.lon
                  ? `${endereco.enderecoOriginal.lat},${endereco.enderecoOriginal.lon}`
                  : `${encodeURI(
                      `${endereco.enderecoOriginal.rua} ${endereco.numero}, ${endereco.enderecoOriginal.bairro}`
                    )}`
              }&z=15&output=embed&ie=UTF8&iwloc=A`}
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              width={`100%`}
              height={`100%`}
            ></iframe>
          </div>

          <h4 className="endereco">
            {[endereco.enderecoOriginal.rua, endereco.numero]
              .filter(Boolean)
              .map((x) => x.toUpperCase())
              .join(", ")}
          </h4>

          <p>
            {[endereco.local, endereco.referencia]
              .filter(Boolean)
              .map((x) => x.toUpperCase())
              .join(", ")}
          </p>

          <small>
            {[
              endereco.enderecoOriginal.bairro,
              formatCEP(endereco.enderecoOriginal.cep),
            ]
              .filter(Boolean)
              .map((x) => x.toUpperCase())
              .join(", ")}
          </small>

          <BottomControls
            secondaryButton={{
              text: "Voltar",
              click: () => {
                router.back();
              },
            }}
            primaryButton={{
              text: "Confirmar",
              click: async () => {
                try {
                  const res = await axios.post(
                    `${env.apiURL}/clientes/endereco`,
                    {
                      clienteId: cliente.id,
                      novoEndereco: endereco,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (axiosOk(res.status)) {
                    // const data = await res.data;
                    // localStorage.setItem("cliente", JSON.stringify(data));
                    router.replace("/pedido/tipo");
                  }
                } catch (err) {
                  toast.error(
                    "Oops, não foi possível fazer seu cadastro no momento!"
                  );
                }
                router.push("/pedido/tipo");
              },
            }}
          />
        </>
      )}
    </ConfirmacaoComplementoViewStyle>
  );
};
//ver como vou fazer o fluxo do cliente, cadastrar na hora q colocar as primeiras infos, depois atualizar com o endereço
