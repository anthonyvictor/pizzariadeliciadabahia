import { colors } from "@styles/colors";
import styled from "styled-components";
import { LojaLayout } from "../../layout";

export const ClientesViewStyle = styled(LojaLayout)``;

export const ListaClientes = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  list-style: none;
  overflow-y: auto;
`;

export const ItemCliente = styled.li.attrs(
  (props: { avatarColor: string }) => props,
)`
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 5px;

  background: ${colors.background}80;
  border: 1px solid ${colors.background};
  border-radius: 16px;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.99);
  }

  .avatar {
    width: 52px;
    height: 52px;
    flex-shrink: 0;

    border-radius: 50%;

    background: ${({ avatarColor }) => avatarColor};

    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: 700;
    font-size: 1.1rem;
  }

  .conteudo {
    flex: 1;

    display: flex;
    flex-direction: column;

    min-width: 0;
    gap: 4px;
  }

  .topo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topo strong {
    flex: 1;

    font-size: 1rem;
    color: #fff;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .telefone {
    font-size: 0.88rem;
    color: #ffffff99;
  }

  .endereco {
    font-size: 0.82rem;
    color: #ffffff90;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .pontos {
    padding: 4px 8px;

    border-radius: 999px;

    background: #ffe8a3;
    color: #8a5b00;

    font-size: 0.75rem;
    font-weight: 600;

    white-space: nowrap;
  }

  .controls {
    flex-shrink: 0;
    display: flex;

    font-size: 22px;

    transition: 0.2s;

    button {
      background: none;
      color: #fff;
      border: none;
      padding: 0 10px;
      font-size: 1.5rem;
    }
  }
`;
