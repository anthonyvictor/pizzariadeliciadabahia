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
import { useConfigsStore } from "src/infra/zustand/configs";

const Warn = ({ action }: { action: () => void }) => {
  const [showBt, setShowBt] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBt(true);
    }, 1000 * 5);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <TextContainer
        title="Aviso!"
        subtitle="Entregas limitadas à Ondina"
        description={`Por questões logísticas, neste fim de semana, estamos entregando apenas no bairro de Ondina.`}
      />
      {showBt && (
        <ButtonSecondary
          onClick={() => {
            action();
          }}
        >
          Ok, entendi
        </ButtonSecondary>
      )}
    </>
  );
};

const PedidoPage: NextPage = () => {
  const { authCarregado, aberto } = useAuth();

  const { configs } = useConfigsStore();
  const [lockerOpen, setLockerOpen] = useState(true);
  const [lockerWarn, setLockerWarn] = useState(true);
  const [warn] = useState(null);
  //   <Warn
  //     action={() => {
  //       setLockerWarn(false);
  //       sessionStorage.setItem("warn-already-shown", "false");
  //     }}
  //   />
  // );

  useEffect(() => {
    const _locker = sessionStorage.getItem("fechado-locker");
    if (_locker === "false") {
      setLockerOpen(false);
    }

    const warnAlreadyShown = sessionStorage.getItem("warn-already-shown");
    if (warnAlreadyShown === "false") {
      setLockerWarn(false);
    }
  }, []);

  const horario = configs.find((x) => x.chave === "horario_funcionamento")
    ?.valor as IConfigHorarioFuncionamento | undefined;

  function formatFriendly(_date: Date) {
    const now = new Date();
    const date = new Date(_date);
    const dateForCalc = new Date(_date);
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    const diffDays = Math.floor(
      (dateForCalc.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0)
      return `hoje, às ${date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

    if (diffDays === 1)
      return `amanhã, às ${date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

    return formatter.format(date);
  }

  if (!authCarregado) return <Loading />;

  return (
    <PedidoPageProvider aberto={aberto}>
      <PedidoView />
      {!aberto && lockerOpen ? (
        <LockerStyle>
          <TextContainer
            title="Estamos fechados no momento"
            subtitle="Mas fique à vontade para conferir nosso cardápio!"
            description={
              horario?.fechadoAte &&
              new Date(horario.fechadoAte).getTime() > new Date().getTime()
                ? `Retornamos ${formatFriendly(horario.fechadoAte)}`
                : horario?.descricao
                ? horario.descricao
                : "Fique de olho em nossas redes sociais para atualizações!"
            }
          />
          <ButtonSecondary
            onClick={() => {
              setLockerOpen(false);
              sessionStorage.setItem("fechado-locker", "false");
            }}
          >
            Ver cardápio
          </ButtonSecondary>
        </LockerStyle>
      ) : !!warn && lockerWarn ? (
        <LockerStyle>{warn}</LockerStyle>
      ) : (
        <></>
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
