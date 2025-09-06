import TextContainer from "@components/textContainer";
import { colors } from "@styles/colors";
import { NextPage } from "next";
import { useModoStore } from "src/infra/zustand/modo";
import styled from "styled-components";

const ModoPage: NextPage = () => {
  const { modo, setModo } = useModoStore();

  console.log(modo);

  return (
    <Style>
      <TextContainer
        title="Modo de pedido"
        description="Selecione uma forma de fazer pedidos"
      />
      <button
        onClick={() => setModo("cliente")}
        className={`bt ${modo === "cliente" && "checked"}`}
      >
        <section>
          <h6>Cliente final</h6>
          <p>
            Dispositivo pessoal do cliente. Os dados do cliente são armazenados
            permanentemente.
          </p>
        </section>
        {modo === "cliente" && <span className="check" />}
      </button>
      <button
        onClick={() => setModo("autoatendimento")}
        className={`bt ${modo === "autoatendimento" && "checked"}`}
      >
        <section>
          <h6>Autoatendimento</h6>
          <p>
            Máquina de autoatendimento. Os dados do cliente são apagados ao
            finalizar o pedido.
          </p>
        </section>
      </button>
      <button
        onClick={() => setModo("atendente")}
        className={`bt ${modo === "atendente" && "checked"}`}
      >
        <section>
          <h6>Atendente</h6>
          <p>Sistema PDV. Voltado para atendentes no balcão de vendas.</p>
        </section>
      </button>
    </Style>
  );
};

const Style = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;

  button {
    padding: 15px;
    font-size: 2rem;
    border: none;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid ${colors.elements};
    background-color: ${colors.elements}99;

    section {
      display: flex;
      flex-direction: column;
      text-align: start;
      p {
        font-size: 0.7rem;
      }
    }
    &.checked {
      background-color: ${colors.elements};
      /* border: 2px solid #000; */
    }
  }
`;

export default ModoPage;
