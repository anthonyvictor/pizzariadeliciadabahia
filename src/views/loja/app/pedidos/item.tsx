import { IPedido } from "tpdb-lib";
import { usePedidos } from "./context";
import { formatCEP, formatCurrency } from "@util/format";
import { MensagemStyle, PedidoItemStyle } from "./styles";
// import { upsertArray } from "@util/state";
// import { salvar } from "../../util/func";
import { Descricao } from "src/views/loja/components/listas/descricao";
import { getDuracao, getDuracaoCor } from "@util/date";
import { MdHouse, MdMessage } from "react-icons/md";
import { FaCog, FaMotorcycle } from "react-icons/fa";
import { join } from "@util/misc";
import { getCount } from "@util/array";
import { obterValoresDoPedido } from "@util/pedidos";
import { BiCheck, BiCog, BiMessage, BiPrinter, BiTrash } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Mensagens } from "./mensagens";

export const PedidoItem = ({ pedido }: { pedido: IPedido }) => {
  const { setEditando, setPedidos } = usePedidos();

  // const pizzas = pedido.itens.filter((x) => x.tipo === "pizza");
  // const bebidas = getCount(
  //   pedido.itens.filter((x) => x.tipo === "bebida"),
  //   (x) => x.bebidaOriginal.id,
  // );
  // const lanches = getCount(
  //   pedido.itens.filter((x) => x.tipo === "lanche"),
  //   (x) => x.lancheOriginal.id,
  // );
  // const itens = [...pizzas, ...bebidas, ...lanches];
  const [modal, setModal] = useState(<></>);

  const SidebarBt = ({
    ico,
    click,
    title,
    disabled,
  }: {
    ico: JSX.Element;
    click: () => void | Promise<void>;
    title: string;
    disabled?: boolean;
  }) => {
    return (
      <button
        title={title}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          click();
        }}
      >
        {ico}
      </button>
    );
  };
  return (
    <PedidoItemStyle
      key={pedido.id}
      className="pedido"
      pedido={pedido}
      // onClick={}
    >
      <main>
        <header>
          <h5 className="ped-nome">{pedido.cliente.nome.toUpperCase()}</h5>
          <div className="ped-duracao">
            <span
              className="ped-data-cor"
              style={{ backgroundColor: getDuracaoCor(pedido.atualizadoEm) }}
            />
            <h5 className="ped-data">{getDuracao(pedido.atualizadoEm)}</h5>
          </div>
          <h2 className="ped-tipo">
            {pedido.tipo === "retirada" ? (
              <MdHouse color="white" />
            ) : (
              <FaMotorcycle color="#85b4ff" />
            )}
          </h2>
        </header>
        {pedido.tipo === "entrega" && pedido.endereco.enderecoOriginal && (
          <div className="endereco">
            <p className="endereco-texto">
              {join([
                pedido.endereco.enderecoOriginal.rua,
                pedido.endereco.numero,
                pedido.endereco.local,
                pedido.endereco.enderecoOriginal.bairro,
                pedido.endereco.enderecoOriginal.cidade
                  .toLowerCase()
                  .includes("salvador")
                  ? ""
                  : pedido.endereco.enderecoOriginal.cidade,
                pedido.endereco.referencia,
                formatCEP(pedido.endereco.enderecoOriginal.cep),
                `Taxa: ${formatCurrency(eval(`${pedido.endereco.taxa}${pedido.endereco.desconto ?? ""}`))}${pedido.endereco.metodo === "avancado" ? " (c/trecho à pé)" : ""}`,
              ])}
            </p>
          </div>
        )}

        <ul className="itens">
          {pedido.itens.map((item) => (
            <li
              className={`item ${item.tipo === "pizza" ? "pizza" : "outro"}`}
              key={item.id}
            >
              {/* <aside className="esq">
                <Imagem
                  url={
                    item.tipo === "pizza"
                      ? item.tamanho.imagemUrl
                      : item.tipo === "bebida"
                        ? item.bebidaOriginal.imagemUrl
                        : item.lancheOriginal.imagemUrl
                  }
                  aspectRatio={"portrait"}
                />
              </aside> */}
              <aside className="esq">
                {/* {item.tipo !== "pizza" && item.count > 1 && (
                  <h4>{item.count}x</h4>
                )} */}
                <h4>
                  {item.tipo === "pizza"
                    ? `Pizza ${item.tamanho.nome}`
                    : item.tipo === "bebida"
                      ? item.bebidaOriginal.nome
                      : item.lancheOriginal.nome}
                </h4>
                {item.tipo === "pizza" ? (
                  <p className="descricao">
                    {join([
                      item.sabores.map((sabor) => sabor.nome).join(", "),
                      item.borda.padrao ? "" : item.borda.nome,
                      item.espessura.padrao ? "" : item.espessura.nome,
                      item.ponto.padrao ? "" : item.ponto.nome,
                      !item.extras.length
                        ? ""
                        : `Adic.: ${getCount(item.extras, (x) => x.id)
                            .map((x) =>
                              x.count > 1 ? `${x.count}x ${x.nome}` : x.nome,
                            )
                            .join(", ")}`,
                      item.observacoes,
                    ])}
                  </p>
                ) : item.observacoes ? (
                  <p className="descricao">{item.observacoes}</p>
                ) : (
                  <></>
                )}
              </aside>
              <aside className="dir">
                <h4>{formatCurrency(item.valor - item.desconto)}</h4>
              </aside>
            </li>
          ))}
        </ul>

        <footer>
          {(() => {
            const { valorTotalBruto, valorTotalComDescontos } =
              obterValoresDoPedido(pedido);
            return (
              <h5 className="total">
                Total: {formatCurrency(valorTotalComDescontos)}
              </h5>
            );
          })()}
          {pedido.pagamentos.map((pagamento) => (
            <h5 key={pagamento.id}>
              {formatCurrency(pagamento.valor - pagamento.desconto)}
              {pagamento.tipo === "cartao"
                ? "Cart."
                : pagamento.tipo === "especie"
                  ? "Esp."
                  : "Pix"}
            </h5>
          ))}
        </footer>
      </main>
      <aside className="sidebar">
        <SidebarBt
          title="Manipular"
          ico={<FaCog />}
          click={() => {
            setEditando(pedido.id);
          }}
        />
        {/* <SidebarBt
          title="Imprimir"
          ico={<BiPrinter />}
          click={() => {
            console.log("imprimir");
          }}
        /> */}
        <SidebarBt
          title="Mensagem"
          disabled={!pedido.itens.length}
          ico={<BiMessage />}
          click={() => {
            console.log("mensagem");
            setModal(
              <Mensagens close={() => setModal(<></>)} pedido={pedido} />,
            );
          }}
        />
        {/* <SidebarBt
          title="Deletar"
          ico={<IoClose />}
          click={() => {
            console.log("deletar");
          }}
        /> */}
        <SidebarBt
          title="Finalizar"
          ico={<BiCheck />}
          click={() => {
            console.log("Finalizar");
          }}
        />
      </aside>
      {/* <Checkers
          item={item}
          infoExtra={[`💲${formatCurrency(pedido.valor)}`]}
          setStat={(s) => {
            const data = { [s.t]: s.v, estoque: null };
            salvar("/pedidos", "pedidos", [{ ...item, ...data }]);
            upsertArray(item, setPedidos, data);
          }}
        />
      */}
      {modal}
    </PedidoItemStyle>
  );
};
