import TextContainer from "@components/textContainer";
import { PedidosViewStyle } from "./styles";
import { usePedidos } from "./context";
import { FloatButton } from "@styles/components/buttons";
import { useState } from "react";
import { Search } from "src/views/loja/components/listas/search";
import { fuzzySearch } from "@util/array";
import { PedidoItem } from "./item";
import { Lista } from "./lista";
import Text from "@components/text";
import Loading from "@components/loading";
// import { Footer } from "src/views/loja/components/listas/footer";

export const PedidosView = () => {
  const { pedidos, setEditando, pedidosCarregados } = usePedidos();
  const [filterSomenteNaoEnviados, setFilterSomenteNaoEnviados] =
    useState(true);
  // const [search, setSearch] = useState("");
  // const categorias = Array.from(new Set(pedidos.map((x) => x.categoria)));
  // const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  // const [statsFiltro, setStatsFiltro] = useState<
  //   { tipo: "visivel" | "disponivel" | "somenteEmCombos"; valor: boolean }[]
  // >([]);
  // const filtrados = pedidos?.length
  //   ? fuzzySearch(pedidos, search, [
  //       { field: "nome", weight: 10 },
  //       { field: "descricao", weight: 5 },
  //       // { field: "categoria", weight: 1 },
  //     ])
  //       // .filter((x) => {
  //       //   if (!categoriasFiltro.length) return true;
  //       //   return categoriasFiltro.includes(x.categoria);
  //       // })
  //       .filter((x) => {
  //         if (!statsFiltro.length) return true;
  //         for (const { tipo, valor } of statsFiltro) {
  //           if ((valor === true && !x[tipo]) || (valor === false && !!x[tipo]))
  //             return false;
  //         }
  //         return true;
  //       })
  //   : [];

  // const Status = ({
  //   tipo,
  //   label,
  // }: {
  //   label: string;
  //   tipo: "visivel" | "disponivel" | "somenteEmCombos";
  // }) => {
  //   const jaTem = statsFiltro.find((x) => x.tipo === tipo);
  //   const stt = !jaTem ? "TODOS" : jaTem.valor ? "SIM" : "NÃO";
  //   const cls =
  //     stt === "SIM" ? "active" : stt === "TODOS" ? "every" : "inactive";
  //   return (
  //     <li
  //       className={`stats ${cls}`}
  //       onClick={() => {
  //         setStatsFiltro((prev) =>
  //           [
  //             ...prev.filter((x) => x.tipo !== tipo),
  //             stt === "NÃO"
  //               ? undefined
  //               : {
  //                   tipo,
  //                   valor: stt === "TODOS" ? true : false,
  //                 },
  //           ].filter(Boolean)
  //         );
  //       }}
  //     >
  //       {label}: {stt}
  //     </li>
  //   );
  // };
  const pedidosFiltrados = pedidos?.length
    ? pedidos.filter((x) => !filterSomenteNaoEnviados || !x.enviadoEm)
    : [];

  return (
    <PedidosViewStyle>
      <header>
        <TextContainer title="Pedidos" />
        <div>
          <button
            className=""
            onClick={() => {
              setFilterSomenteNaoEnviados((prev) => !prev);
            }}
          >
            {filterSomenteNaoEnviados ? "Não Enviados" : "Todos"}
          </button>
        </div>
      </header>
      {/* <Search value={search} setValue={setSearch} /> */}

      <Lista name="pedidos">
        {!pedidosCarregados ? (
          <Loading />
        ) : !pedidosFiltrados.length ? (
          <div className="empty">
            <Text type="title">Sem pedidos!</Text>
            <Text type="subtitle">Não há pedidos para exibir no momento</Text>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <PedidoItem key={pedido.id} pedido={pedido} />
          ))
        )}
      </Lista>
      {/* <Footer itens={pedidos} filtrados={filtrados} /> */}
      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
    </PedidosViewStyle>
  );
};

// <ul className="categorias no-scroll">
//       <li
//         onClick={() => {
//           // setCategoriasFiltro([]);
//           setStatsFiltro([]);
//         }}
//         className={`categoria ${
//           // !categoriasFiltro.length &&
//           !statsFiltro.length ? "active" : ""
//         }`}
//       >
//         Todos
//       </li>

//       <Status label="Disponibilidade" tipo="disponivel" />
//       <Status label="Visibilidade" tipo="visivel" />
//       <Status label="Somente em combos" tipo="somenteEmCombos" />

//       {/* {categorias.map((cat) => (
//         <li
//           key={cat.replace(/[^0-9A-Za-z]/gi, "")}
//           className={`categoria ${
//             categoriasFiltro.includes(cat) ? "active" : ""
//           }`}
//           onClick={() => {
//             setCategoriasFiltro((prev) =>
//               [
//                 ...prev.filter((x) => x !== cat),
//                 prev.includes(cat) ? undefined : cat,
//               ].filter(Boolean)
//             );
//           }}
//         >
//           {cat}
//         </li>
//       ))} */}
//     </ul>

// export const PedidosView = () => {
//   useAuth();

// const [pedidos, setClientes] = useState<ICliente[]>([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     api.get("/clientes", {
//       params: {
//         query: search,
//         page: 1,
//       },
//     });
//   }, [search]);

//   return <PedidosViewStyle>

//   </PedidosViewStyle>;
// };
