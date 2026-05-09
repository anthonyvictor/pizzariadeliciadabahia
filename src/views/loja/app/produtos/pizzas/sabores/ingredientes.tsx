import {
  ModalCloseButton,
  ModalContainer,
  ModalOverlay,
} from "@styles/components/modal";
import { IPedido, IPizzaIngrediente, IPizzaSabor } from "tpdb-lib";
import { IngredientesStyle } from "./styles";
import Text from "@components/text";
import { join } from "@util/misc";
import { formatCurrency, formatPhoneNumber, removeAccents } from "@util/format";
import { getCount } from "@util/array";
import { obterValoresDoPedido } from "@util/pedidos";
import { colors } from "@styles/colors";
import { useState } from "react";
import {
  FaArrowRight,
  FaCheck,
  FaEdit,
  FaInfo,
  FaInfoCircle,
  FaPizzaSlice,
  FaPlus,
  FaSave,
  FaSearch,
  FaTable,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { IoArrowBack, IoDocumentTextSharp } from "react-icons/io5";
import {
  MdArrowBackIos,
  MdArrowForward,
  MdArrowForwardIos,
} from "react-icons/md";
import ReactSwitch from "react-switch";
import { BsInfoCircle } from "react-icons/bs";
import { GiPizzaSlice } from "react-icons/gi";
import { api, axiosOk } from "@util/axios";
import { toast } from "react-toastify";
import { useSabores } from "./context";

export const Ingredientes = ({
  ingrediente,

  close,
}: {
  ingrediente?: IPizzaIngrediente;
  close: () => void;
}) => {
  const [nome, setNome] = useState(ingrediente?.nome || "");
  const [substituto, setSubstituto] = useState(ingrediente?.substituto || "");
  const [disponivel, setDisponivel] = useState(
    ingrediente ? ingrediente.disponivel : true,
  );
  const [tab, setTab] = useState<"list" | "form">(
    ingrediente ? "form" : "list",
  );
  const { sabores, ingredientes, setIngredientes } = useSabores();

  const [search, setSearch] = useState("");

  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const extrairNovosIngredientes = (sabores: IPizzaSabor[]) => {
    const existentes = new Set(ingredientes.map((i) => normalize(i.nome)));

    const nomes = sabores.flatMap((s) => s.ingredientes.map((i) => i.nome));

    const unicos = new Map<string, string>();

    for (const nome of nomes) {
      const normalizado = normalize(nome);

      // ignora se já existe
      if (existentes.has(normalizado)) continue;

      // garante único mantendo nome original
      if (!unicos.has(normalizado)) {
        unicos.set(normalizado, nome);
      }
    }

    return Array.from(unicos.entries()).map(([normalizado, nome]) => ({
      id: normalizado.replace(/\s+/g, "_"),
      nome,
      disponivel: true,
      substituto: "",
      new: true,
      slug: normalizado.replace(/\s+/g, "_"),
    }));
  };

  const todosIngredientes = !sabores
    ? []
    : [...ingredientes, ...extrairNovosIngredientes(sabores)].sort((a, b) => {
        // primeiro: indisponíveis na frente
        if (a.disponivel !== b.disponivel) {
          return a.disponivel ? 1 : -1;
        }

        // depois: ordenar por nome
        return a.nome.localeCompare(b.nome);
      });
  const limpar = () => {
    setNome("");
    setSubstituto("");
    setDisponivel(true);
    document.getElementById("nome")?.focus();
  };
  const salvar = async () => {
    try {
      if (!nome) {
        throw new Error("Informe o nome do ingrediente");
      }

      const data = {
        nome,
        disponivel,
        substituto,
      };

      const res = await api.post(`/pizzas/ingredientes`, {
        ingredientes: [data],
      });

      if (!axiosOk(res.status) || !res.data) throw new Error("Erro ao Salvar");
      setIngredientes((prev) => [
        ...prev.filter(
          (x) => x.slug !== removeAccents(nome.toLowerCase()).replace(" ", "_"),
        ),
        {
          ...data,
          id: nome,
          slug: removeAccents(nome.toLowerCase()).replace(" ", "_"),
        },
      ]);
      limpar();
      setTab("list");
    } catch (err) {
      toast.error("Oops, não foi possível salvar!");
    }

    // await api.post(`/ingredientes`, {
    //   ingrediente: { nome, disponivel, substituto },
    // });
  };

  const remover = async (item: IPizzaIngrediente) => {
    try {
      console.log("foiiiiiiii");
      const res = await api.post(`/pizzas/ingredientes`, {
        ingredientes: [{ ...item, disponivel: true }],
      });

      if (!axiosOk(res.status) || !res.data) throw new Error("Erro ao Salvar");
      setIngredientes((prev) => [
        ...prev.filter(
          (x) =>
            x.slug !== removeAccents(item.nome.toLowerCase()).replace(" ", "_"),
        ),
        {
          ...item,
          disponivel: true,
        },
      ]);
      limpar();
      setTab("list");
    } catch (err) {
      toast.error("Oops, não foi possível salvar!");
    }

    // await api.post(`/ingredientes`, {
    //   ingrediente: { nome, disponivel, substituto },
    // });
  };
  return (
    <ModalOverlay>
      <ModalContainer style={{ gap: "10px" }}>
        <ModalCloseButton onClick={close} />
        <IngredientesStyle>
          <header>
            <button
              onClick={() => setTab("list")}
              className={`back-button ${tab === "list" ? `hidden` : ""}`}
            >
              <MdArrowBackIos />
            </button>
            <div className="header-info">
              <Text type="title">Ingredientes</Text>
              <Text type="description">
                Gerencie os ingredientes e suas substituições
              </Text>
            </div>
          </header>
          <main>
            {tab === "list" ? (
              <aside key="list" className="esq">
                <nav>
                  <div className="search-wrapper">
                    <FaSearch />
                    <input
                      placeholder="Buscar ingrediente..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      tabIndex={0}
                      autoFocus
                    />
                  </div>
                  <button onClick={() => setTab("form")}>
                    <FaPlus />
                    <span>Novo</span>
                  </button>
                </nav>
                <div className="ul-description">
                  <label>Lista de ingredientes</label>
                  <h5>{todosIngredientes.length}</h5>
                </div>
                <ul className="ingredientes">
                  {todosIngredientes
                    .filter((x) =>
                      search
                        ? removeAccents(x.nome.toLowerCase()).includes(
                            removeAccents(search.toLowerCase()),
                          )
                        : true,
                    )
                    .map((item) => (
                      <Ingrediente
                        key={item.id}
                        item={item}
                        editIngrediente={() => {
                          setNome(item.nome);
                          setSubstituto(item.substituto || "");
                          setDisponivel(item.disponivel);
                          setTab("form");
                        }}
                        removeIngrediente={(item) => {
                          remover(item);
                        }}
                      />
                    ))}
                </ul>
              </aside>
            ) : (
              <aside key="form" className="dir">
                <form>
                  <h5 className="form-title">
                    <IoDocumentTextSharp />
                    <span>Dados do ingrediente:</span>
                  </h5>
                  <div
                    className="wrapper-nome-disponivel"
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "start",
                    }}
                  >
                    <fieldset className="wrapper-nome">
                      <label htmlFor="nome" autoFocus={nome === ""}>
                        Nome do ingrediente
                      </label>
                      <input
                        name="nome"
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </fieldset>
                    <fieldset className="wrapper-disponivel">
                      <label htmlFor="nome">Disponibilidade</label>
                      <div className="wrapper-switch">
                        <ReactSwitch
                          className="switch"
                          // width={40}
                          // height={40}
                          checked={disponivel}
                          onChange={(e) => setDisponivel(e)}
                        />
                        <span className="switch-title">
                          {disponivel ? "Disponível" : "Indisponível"}
                        </span>
                      </div>
                    </fieldset>
                  </div>

                  <fieldset>
                    <label htmlFor="substituto">
                      Substituto (quando disponível)
                    </label>
                    <input
                      name="substituto"
                      id="substituto"
                      type="text"
                      value={substituto || ""}
                      autoFocus={nome !== ""}
                      onChange={(e) => setSubstituto(e.target.value)}
                    />
                  </fieldset>
                  <div className="substituto-info">
                    <BsInfoCircle />
                    <p>
                      Quando{" "}
                      <span
                        style={{
                          color: nome.length >= 4 ? "#ffe600" : undefined,
                        }}
                      >
                        {nome.length >= 4 ? nome : "o ingrediente"}
                      </span>{" "}
                      estiver indisponível, o sistema irá{" "}
                      {substituto.length >= 4 ? (
                        <>
                          exibir{" "}
                          <span style={{ color: nome ? "#ffe600" : undefined }}>
                            {substituto || "outro"}
                          </span>{" "}
                          como substituto
                        </>
                      ) : (
                        <>avisar ao cliente</>
                      )}
                    </p>
                  </div>
                  <div className="utilizado-em">
                    <h5 className="form-title">
                      <FaPizzaSlice />
                      <span>Utilizado nos sabores:</span>
                    </h5>
                    <ul className="sabores">
                      {sabores
                        .filter((sab) => {
                          console.log(sab);
                          return sab.ingredientes.some((ing) => {
                            console.log(
                              "removeAccents(ing.nome.toLowerCase())",
                              removeAccents(ing.nome.toLowerCase()),
                              "\n",
                              "removeAccents(nome.toLowerCase())",
                              removeAccents(nome.toLowerCase()),
                            );
                            return (
                              removeAccents(ing.nome.toLowerCase()) ===
                              removeAccents(nome.toLowerCase())
                            );
                          });
                        })
                        .map((sab) => (
                          <li key={sab.id} className={"sabor"}>
                            {sab.nome}
                          </li>
                        ))}
                    </ul>
                  </div>
                </form>
              </aside>
            )}
          </main>
          <footer>
            {tab === "list" ? (
              <div className="footer-info">
                <BsInfoCircle />
                <p>Clique em um ingrediente para editá-lo</p>
              </div>
            ) : (
              <div className="footer-buttons">
                <button
                  onClick={(e) => {
                    limpar();
                  }}
                  style={{ backgroundColor: "#991400", borderColor: "#f75a41" }}
                >
                  <FaTrash /> <span>Limpar campos</span>
                </button>
                <button
                  onClick={(e) => {
                    salvar();
                  }}
                  style={{ backgroundColor: "#017e01", borderColor: "#67f867" }}
                >
                  <FaSave />
                  <span>Salvar alterações</span>
                </button>
              </div>
            )}
          </footer>
        </IngredientesStyle>
      </ModalContainer>
    </ModalOverlay>
  );
};

const Ingrediente = ({
  item,
  editIngrediente,
  removeIngrediente,
}: {
  item: IPizzaIngrediente;
  editIngrediente: (item: IPizzaIngrediente) => void;
  removeIngrediente: (item: IPizzaIngrediente) => void;
}) => {
  const [isInside, setIsInside] = useState(false);

  return (
    <li
      key={item.id}
      className={`item ${item.disponivel ? "" : "disabled"}`}
      onMouseEnter={() => {
        setIsInside(true);
      }}
      onMouseLeave={() => {
        setIsInside(false);
      }}
      // onClick={(e) => {
      //   e.stopPropagation();

      //   removeIngrediente(item);
      // }}
    >
      <div className="ingr-nome-subs">
        <h5>{item.nome[0].toUpperCase() + item.nome.slice(1)}</h5>
        {item.substituto && (
          <small>
            <span>Substitui por </span>
            <span style={{ color: colors.elements }}>{item.substituto}</span>
          </small>
        )}
      </div>
      <div className="ingr-disp">
        <b
          style={{
            backgroundColor: item.disponivel ? "#05910079" : "#ff220061",
            color: item.disponivel ? "#5eff5e" : "#ff9c8d",
          }}
        >
          {item.disponivel ? "Disponivel" : "Indisponivel"}
        </b>
        <MdArrowForwardIos />
      </div>
      {isInside && (
        <div className="controls">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editIngrediente(item);
            }}
          >
            <FaEdit />
          </button>
          <hr />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("CLICKKKKKKKKKKKKKKKKKKKKKKKK", item);
              removeIngrediente(item);
            }}
          >
            <FaTrash />
          </button>
        </div>
      )}
    </li>
  );
};
