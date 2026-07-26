import { useEffect, useState } from "react";
import { ClientesViewStyle, ItemCliente, ListaClientes } from "./styles";
import { ICliente } from "tpdb-lib";
import { api } from "@util/axios";
import { MyInput } from "@components/pedido/myInput";
import { useAuth } from "../../auth";
import { clientesFicticios } from "./clientes";
import { avatarColors } from "@styles/avatarColors";
import { formatPhoneNumber } from "@util/format";
import { FaEdit } from "react-icons/fa";
import { MdKeyboardArrowDown, MdModeEditOutline } from "react-icons/md";

export const ClientesView = () => {
  useAuth();
  const [clientes, setClientes] = useState<ICliente[]>(clientesFicticios);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // api.get("/clientes", {
    //   params: {
    //     query: search,
    //     page: 1,
    //   },
    // });
  }, [search]);

  function getIniciais(nome: string) {
    const partes = nome.trim().split(/\s+/);

    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }

    return partes[0].slice(0, 2).toUpperCase();
  }

  return (
    <ClientesViewStyle>
      <MyInput type="text" name="Pesquisa..." placeholder="Nome, telefone" />

      <ListaClientes
        theme={{
          colors: {
            primary: "#8a5b00",
            secondary: "#f5f5f5",
            tertiary: "#ffdfb3",
            text: {
              primary: "#8a5b00",
              secondary: "#f5f5f5",
              tertiary: "#ffdfb3",
            },
          },
        }}
      >
        {clientes.map((cliente) => {
          const endereco = cliente.enderecos?.find((e) => e.visivel);

          return (
            <ItemCliente
              key={cliente.id}
              avatarColor={
                avatarColors[Math.floor(Math.random() * avatarColors.length)]
              }
            >
              <div className="avatar">{getIniciais(cliente.nome)}</div>

              <div className="conteudo">
                <div className="topo">
                  <strong>{cliente.nome}</strong>

                  <span className="pontos">⭐ {cliente.pontos}</span>
                </div>

                <span className="telefone">
                  {formatPhoneNumber(cliente.whatsapp, false, false)}
                </span>

                {endereco && (
                  <span className="endereco">
                    📍 {endereco.enderecoOriginal.rua}, {endereco.numero} •{" "}
                    {endereco.enderecoOriginal.bairro}
                  </span>
                )}
              </div>

              <div className="controls">
                <button
                  style={{ fontSize: "2.5rem", transform: "translateY(4px)" }}
                >
                  <MdKeyboardArrowDown />
                </button>
                <button>
                  <MdModeEditOutline />
                </button>
              </div>
            </ItemCliente>
          );
        })}
      </ListaClientes>
    </ClientesViewStyle>
  );
};
