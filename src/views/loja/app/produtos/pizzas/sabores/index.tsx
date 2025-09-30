import TextContainer from "@components/textContainer";
import { SaboresViewStyle } from "./styles";
import Image from "next/image";
import { useSabores } from "./context";
import { FloatButton } from "@styles/components/buttons";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { useState } from "react";
import { Search } from "src/views/loja/components/listas/search";
import { fuzzySearch } from "@util/array";
import { formatCurrency } from "@util/format";

export const SaboresView = () => {
  const { sabores, setEditando } = useSabores();
  const [search, setSearch] = useState("");
  const categorias = Array.from(new Set(sabores.map((x) => x.categoria)));
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  const [statsFiltro, setStatsFiltro] = useState<
    { tipo: "visivel" | "disponivel" | "somenteEmCombos"; valor: boolean }[]
  >([]);
  const filtrados = sabores
    ? fuzzySearch(sabores, search, [
        { field: "nome", weight: 10 },
        { field: "descricao", weight: 5 },
        { field: "categoria", weight: 1 },
      ])
        .filter((x) => {
          if (!categoriasFiltro.length) return true;
          return categoriasFiltro.includes(x.categoria);
        })
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
    <SaboresViewStyle>
      <TextContainer title="Sabores" />
      <Search value={search} setValue={setSearch} />
      <ul className="categorias no-scroll">
        <li
          onClick={() => {
            setCategoriasFiltro([]);
            setStatsFiltro([]);
          }}
          className={`categoria ${
            !categoriasFiltro.length && !statsFiltro.length ? "active" : ""
          }`}
        >
          Todos
        </li>

        <Status label="Disponibilidade" tipo="disponivel" />
        <Status label="Visibilidade" tipo="visivel" />
        <Status label="Somente em combos" tipo="somenteEmCombos" />

        {categorias.map((cat) => (
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
        ))}
      </ul>
      <ul className="sabores no-scroll">
        {filtrados.map((item) => {
          const valores = item.valores.map((x) => x.valor);
          const min = Math.min(...valores);
          const max = Math.max(...valores);
          return (
            <li
              key={item.id}
              className="sabor"
              onClick={() => setEditando(item.id)}
            >
              <aside className="esq">
                <Imagem url={item.imagemUrl} />
              </aside>
              <aside className="dir">
                <h5 className="nome">
                  <span>{item.nome}</span>
                  <span style={{ marginRight: "5px" }}>•</span>
                  <span>{item.categoria ?? "s/Categ"}</span>
                </h5>

                {item.descricao && (
                  <small style={{ fontSize: ".7rem" }} className="descricao">
                    {item.descricao}
                  </small>
                )}

                <Checkers
                  item={item}
                  infoExtra={[
                    `💲${formatCurrency(min).replace(
                      ",00",
                      ""
                    )} - ${formatCurrency(max).replace(",00", "")}`,
                  ]}
                />
              </aside>
            </li>
          );
        })}
      </ul>
      <div className="bottom-info">
        <h4 className="len">
          {filtrados.length} / {sabores.length}
        </h4>
      </div>
      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
    </SaboresViewStyle>
  );
};
