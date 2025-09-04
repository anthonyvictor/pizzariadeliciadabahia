import { useEffect, useState } from "react";
import { ClientesViewStyle } from "./styles";
import { ICliente } from "tpdb-lib";
import { api } from "@util/axios";
import { MyInput } from "@components/pedido/myInput";
import { useAuth } from "../../auth";

export const ClientesView = () => {
  useAuth();
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/clientes", {
      params: {
        query: search,
        page: 1,
      },
    });
  }, [search]);

  return (
    <ClientesViewStyle>
      <MyInput type="text" name="Pesquisa..." placeholder="Nome, telefone" />
    </ClientesViewStyle>
  );
};
