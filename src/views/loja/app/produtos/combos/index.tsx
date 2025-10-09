import TextContainer from "@components/textContainer";
import { CombosViewStyle } from "./styles";
import { useCombos } from "./context";
import { FloatButton } from "@styles/components/buttons";
import { useState } from "react";
import { Search } from "src/views/loja/components/listas/search";
import { fuzzySearch } from "@util/array";
import { ComboItem } from "./item";
import { Lista } from "../lista";
import { Footer } from "src/views/loja/components/listas/footer";

export const CombosView = () => {
  const {
    combos,
    setEditando,
    search,
    setSearch,
    statsFiltro,
    setStatsFiltro,
  } = useCombos();
  // const categorias = Array.from(new Set(combos.map((x) => x.categoria)));
  // const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);

  const filtrados = combos?.length
    ? fuzzySearch(combos, search, [
        { field: "nome", weight: 10 },
        { field: "descricao", weight: 5 },
        // { field: "categoria", weight: 1 },
      ])
        // .filter((x) => {
        //   if (!categoriasFiltro.length) return true;
        //   return categoriasFiltro.includes(x.categoria);
        // })
        .filter((x) => {
          if (!statsFiltro.length) return true;
          for (const { tipo, valor } of statsFiltro) {
            if ((valor === true && !x[tipo]) || (valor === false && !!x[tipo]))
              return false;
          }
          return true;
        })
    : [];

  const Status = ({
    tipo,
    label,
  }: {
    label: string;
    tipo: "visivel" | "disponivel" | "somenteEmCombos";
  }) => {
    const jaTem = statsFiltro.find((x) => x.tipo === tipo);
    const stt = !jaTem ? "TODOS" : jaTem.valor ? "SIM" : "NÃO";
    const cls =
      stt === "SIM" ? "active" : stt === "TODOS" ? "every" : "inactive";
    return (
      <li
        className={`stats ${cls}`}
        onClick={() => {
          setStatsFiltro((prev) =>
            [
              ...prev.filter((x) => x.tipo !== tipo),
              stt === "NÃO"
                ? undefined
                : {
                    tipo,
                    valor: stt === "TODOS" ? true : false,
                  },
            ].filter(Boolean)
          );
        }}
      >
        {label}: {stt}
      </li>
    );
  };

  return (
    <CombosViewStyle>
      <TextContainer title="Combos" />
      <Search value={search} setValue={setSearch} />
      <ul className="categorias no-scroll">
        <li
          onClick={() => {
            // setCategoriasFiltro([]);
            setStatsFiltro([]);
          }}
          className={`categoria ${
            // !categoriasFiltro.length &&
            !statsFiltro.length ? "active" : ""
          }`}
        >
          Todos
        </li>

        <Status label="Disponibilidade" tipo="disponivel" />
        <Status label="Visibilidade" tipo="visivel" />
        <Status label="Somente em combos" tipo="somenteEmCombos" />

        {/* {categorias.map((cat) => (
          <li
            key={cat.replace(/[^0-9A-Za-z]/gi, "")}
            className={`categoria ${
              categoriasFiltro.includes(cat) ? "active" : ""
            }`}
            onClick={() => {
              setCategoriasFiltro((prev) =>
                [
                  ...prev.filter((x) => x !== cat),
                  prev.includes(cat) ? undefined : cat,
                ].filter(Boolean)
              );
            }}
          >
            {cat}
          </li>
        ))} */}
      </ul>
      <Lista name="combos">
        {filtrados.map((item) => (
          <ComboItem key={item.id} item={item} />
        ))}
      </Lista>
      <Footer itens={combos} filtrados={filtrados} />
      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
    </CombosViewStyle>
  );
};
