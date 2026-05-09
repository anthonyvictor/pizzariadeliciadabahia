import TextContainer from "@components/textContainer";
import { SaboresViewStyle } from "./styles";
import Image from "next/image";
import { useSabores } from "./context";
import { FloatButton } from "@styles/components/buttons";
import { Checkers } from "src/views/loja/components/listas/checkers";
import { Imagem } from "src/views/loja/components/listas/imagem";
import { useEffect, useState } from "react";
import { Search } from "src/views/loja/components/listas/search";
import { fuzzySearch } from "@util/array";
import { formatCurrency, removeAccents } from "@util/format";
import { SaborItem } from "./item";
import { Lista } from "../../lista";
import { Footer } from "src/views/loja/components/listas/footer";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useConfigsStore } from "src/infra/zustand/configs";
import { IPizzaIngrediente, IPizzaSabor } from "tpdb-lib";
import { Ingredientes } from "./ingredientes";
import { api, axiosOk } from "@util/axios";
import { toast } from "react-toastify";

export const SaboresView = () => {
  const { sabores, setEditando, ingredientes, setIngredientes } = useSabores();
  const [search, setSearch] = useState("");
  const categorias = Array.from(new Set(sabores.map((x) => x.categoria)));
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  const [statsFiltro, setStatsFiltro] = useState<
    { tipo: "visivel" | "disponivel" | "somenteEmCombos"; valor: boolean }[]
  >([]);

  const [modal, setModal] = useState(<></>);

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
            ].filter(Boolean),
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
                ].filter(Boolean),
              );
            }}
          >
            {cat}
          </li>
        ))}
      </ul>
      <div className="ingredientes-indisponiveis">
        <span className="ingrs-titulo">Ingredientes indisponíveis:</span>
        <div className="centro">
          <button
            className="add-ingrediente"
            onClick={() => {
              setModal(<Ingredientes close={() => setModal(<></>)} />);
            }}
          >
            <FaPlus />
          </button>
          <ul className="ingredientes">
            {ingredientes
              .filter((x) => !x.disponivel)
              .map((ingr) => (
                <li key={ingr.id} className="ingrediente">
                  <div
                    onClick={() => {
                      setModal(
                        <Ingredientes
                          ingrediente={ingr}
                          close={() => setModal(<></>)}
                        />,
                      );
                    }}
                  >
                    <span>{ingr.nome}</span>
                    {ingr.substituto && <span>({ingr.substituto})</span>}
                  </div>
                  <button
                    className="ingr-deletar"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const remover = async (item: IPizzaIngrediente) => {
                        try {
                          console.log("foiiiiiiii");
                          const res = await api.post(`/pizzas/ingredientes`, {
                            ingredientes: [{ ...item, disponivel: true }],
                          });

                          if (!axiosOk(res.status) || !res.data)
                            throw new Error("Erro ao Salvar");
                          setIngredientes((prev) => [
                            ...prev.filter(
                              (x) =>
                                item.slug !==
                                removeAccents(x.nome.toLowerCase()).replace(
                                  " ",
                                  "_",
                                ),
                            ),
                            {
                              ...item,
                              disponivel: true,
                            },
                          ]);
                        } catch (err) {
                          toast.error("Oops, não foi possível salvar!");
                        }

                        // await api.post(`/ingredientes`, {
                        //   ingrediente: { nome, disponivel, substituto },
                        // });
                      };

                      remover(ingr);
                    }}
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <Lista name="sabores">
        {filtrados.map((item) => (
          <SaborItem key={item.id} item={item} />
        ))}
      </Lista>
      <Footer itens={sabores} filtrados={filtrados} />

      <FloatButton
        onClick={() => {
          setEditando("");
        }}
      />
      {modal}
    </SaboresViewStyle>
  );
};
