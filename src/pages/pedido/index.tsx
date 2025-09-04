import { NextPage } from "next";
import { PedidoPageProvider } from "src/views/pedido/inicio/context";
import { PedidoView } from "src/views/pedido/inicio";
import { useAuth } from "@util/hooks/auth";
import { useEffect, useState } from "react";
import Loading from "@components/loading";
import { IConfigHorarioFuncionamento } from "tpdb-lib";
import TextContainer from "@components/textContainer";
import styled from "styled-components";
import { ButtonSecondary } from "@styles/components/buttons";

const PedidoPage: NextPage = () => {
  const { authCarregado, aberto, configs } = useAuth();
  const [locker, setLocker] = useState(true);

  useEffect(() => {
    const _locker = sessionStorage.getItem("fechado-locker");
    console.log("_locker", _locker);
    if (_locker === "false") {
      console.log("entrou");
      setLocker(false);
    }
  }, []);

  console.log("aberto", aberto);

  const horario = configs.find((x) => x.chave === "horario_funcionamento")
    ?.valor as IConfigHorarioFuncionamento | undefined;

  if (!authCarregado) return <Loading />;

  return (
    <PedidoPageProvider aberto={aberto}>
      <PedidoView />
      {!aberto && locker && (
        <LockerStyle>
          <TextContainer
            title="Estamos fechados no momento"
            subtitle="Mas fique à vontade para conferir nosso cardápio!"
            description={
              horario?.fechadoAte
                ? `Retornamos em ${horario.fechadoAte.toLocaleString("pt-BR", {
                    dateStyle: "long",
                    timeStyle: "full",
                  })}`
                : horario?.descricao
                ? horario.descricao
                : "Fique de olho em nossas redes sociais para atualizações!"
            }
          />
          <ButtonSecondary
            onClick={() => {
              setLocker(false);
              sessionStorage.setItem("fechado-locker", "false");
            }}
          >
            Ver cardápio
          </ButtonSecondary>
        </LockerStyle>
      )}
    </PedidoPageProvider>
  );
};

const LockerStyle = styled.div`
  background-color: #000000cf;
  position: fixed;
  z-index: 999;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  padding: 25px;
  backdrop-filter: blur(10px);
`;
export default PedidoPage;
