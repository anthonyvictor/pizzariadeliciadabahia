import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import {
  ConfirmacaoStyle,
  InfoStyle,
} from "@styles/pages/pedido/confirmacao/styles";
import { useMyOrder } from "@context/myOrderContext";
import { ButtonPrimary, ButtonSecondary } from "@styles/components/buttons";
import { useRouter } from "next/router";
import { ICliente, IPedido } from "@models/order";
import { IPizza } from "@models/item";
import { IOutro } from "@models/outro";
import Link from "next/link";
import { formatCurrency } from "@util/format";
import { env } from "@config/env";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import { toast } from "react-toastify";
import axios from "axios";
import { usePromo } from "@context/promoContext";
import Loading from "@components/loading";
import { taxaGratisAteTalHoras } from "@util/promo";

interface IData {
  customer: ICliente;
  type: "retirada" | "entrega";
}

const Confirmacao: NextPage<{ api_url: string; bairroNome: string }> = ({
  api_url,
  bairroNome,
}) => {
  const { myOrder, setId, newOrder } = useMyOrder();
  const { getTaxaGratis, getTaxaGratis36 } = usePromo();
  const router = useRouter();

  const valorItens = myOrder.itens.reduce((acc, item) => acc + item.valor, 0);
  const entregaGratis =
    getTaxaGratis(myOrder.itens) ||
    getTaxaGratis36(myOrder.itens) ||
    taxaGratisAteTalHoras(myOrder);
  const valorEntrega = myOrder.taxaEntrega ?? 0;
  const ehEntrega = myOrder.tipo === "entrega";

  const [tries, setTries] = useState(0);
  const [loading, setLoading] = useState(false);

  const Info = ({ name, value }: { name: string; value: string }) => {
    return (
      <InfoStyle>
        <h5 className="title">{name}</h5>
        <h4 className="value">{value.replace(/---.+---\n/g, "")}</h4>
      </InfoStyle>
    );
  };

  const customer =
    !!myOrder && myOrder?.cliente?.nome?.length > 0
      ? `---CLIENTE---
NOME: ${myOrder.cliente.nome.toUpperCase()}
WHATSAPP: ${myOrder.cliente.whatsapp}
${
  myOrder.tipo === "retirada"
    ? ";VOU RETIRAR NA PIZZARIA;"
    : ";QUERO O DELIVERY;"
}`
      : "";

  const address =
    !!myOrder && ehEntrega && myOrder?.cliente?.endereco?.rua
      ? `---ENTREGA---
ENDEREÇO: ${myOrder.cliente.endereco.rua.toUpperCase()}${
          myOrder.cliente.endereco.numero?.length > 0
            ? `, ${myOrder.cliente.endereco.numero}`
            : ""
        }${`
BAIRRO: ${bairroNome}`}${
          myOrder.cliente.endereco.cep?.length > 0
            ? `
CEP: ${myOrder.cliente.endereco.cep}`
            : ""
        }${
          myOrder.cliente.endereco.localDeEntrega?.length > 0
            ? `
LOCAL DE ENTREGA: ${myOrder.cliente.endereco.localDeEntrega.toUpperCase()}`
            : ""
        }${
          myOrder.cliente.endereco.pontoDeReferencia?.length > 0
            ? `
PONTO DE REFERÊNCIA: ${myOrder.cliente.endereco.pontoDeReferencia.toUpperCase()}`
            : ""
        }`
      : "";

  const items =
    !!myOrder && myOrder?.itens?.length > 0
      ? `---ITENS---
${myOrder.itens.map((item) =>
  item.hasOwnProperty("sabores")
    ? `- --Pizza ${(item as IPizza).tamanho.nome.toUpperCase()}-- 
Sabor${(item as IPizza).sabores.length > 1 ? "es" : ""}: ${(
        item as IPizza
      ).sabores
        .map((s) => s.nome.split(" ").slice(0, -1).join(" ").toUpperCase())
        .join(", ")}${
        !!item.observacao
          ? `
${item.observacao}`
          : ""
      }`
    : `- --${(item as IOutro).nome.toUpperCase()}${
        !!item.observacao
          ? `
${item.observacao}`
          : "--"
      }`
).join(`

`)}`
      : "";

  const total =
    !!myOrder &&
    `---TOTAL---
  ITENS: ${formatCurrency(valorItens)}${
      ehEntrega
        ? entregaGratis && valorEntrega === 0
          ? `
  ENTREGA: GRÁTIS
        `
          : entregaGratis
          ? `ENTREGA: ${formatCurrency(valorEntrega)}`
          : valorEntrega > 0
          ? `
  ENTREGA: ${formatCurrency(valorEntrega)}`
          : ""
        : ""
    }${`
  VALOR TOTAL: ${formatCurrency(valorItens + valorEntrega)}`}${
      ehEntrega && !entregaGratis && !valorEntrega
        ? `
    (FALTA INCLUIR A TAXA DE ENTREGA)`
        : ""
    }`;

  const payment =
    !!myOrder && myOrder?.pagamentos?.length > 0
      ? `---PAGAMENTO---
${myOrder.pagamentos.map(
  (payment) =>
    `${
      payment.tipo === "cartao"
        ? "NO CARTÃO"
        : payment.tipo === "especie"
        ? "EM ESPÉCIE"
        : "NO PIX"
    }${
      payment.trocoPara > payment.valor
        ? `
TROCO PARA ${payment.trocoPara}`
        : payment.tipo === "especie"
        ? `
NÃO VOU PRECISAR DE TROCO`
        : ""
    }`
).join(`

`)}`
      : `---PAGAMENTO---
NÃO INFORMADO.
      `;

  const confirm = async () => {
    const sendOrder = async () => {
      const _pizzas = myOrder.itens.filter(
        (x) => x.tipo === "PIZZA"
      ) as IPizza[];

      const pizzas = _pizzas.map((x, i) => ({
        ...x,
        tamanho: x.tamanho.nome,
        observacao:
          entregaGratis && ehEntrega
            ? `PROMOCIONAL${x.observacao ? ` ${x.observacao}` : ""}`
            : x.observacao,
        valor:
          entregaGratis && ehEntrega && i === 0
            ? x.valor - (myOrder.taxaEntrega === 0 ? 3 : 6)
            : x.valor,
      }));

      const outros = myOrder.itens
        .filter((x) => x.tipo !== "PIZZA")
        .map((x) => ({
          ...x,
          observacao: x.observacao,
        }));

      const reduzirTextoLocal = (local: string | undefined) =>
        ["minha casa", "casa"].some((x) => String(local).toLowerCase() === x)
          ? ""
          : local;

      const order = {
        ...myOrder,
        taxaEntrega: entregaGratis
          ? myOrder.taxaEntrega === 0
            ? 3
            : 6
          : myOrder.taxaEntrega,
        itens: [...pizzas, ...outros],
        endereco: ehEntrega
          ? {
              ...myOrder.cliente?.endereco,
              logradouro: myOrder.cliente?.endereco?.rua,
              local: reduzirTextoLocal(
                myOrder.cliente?.endereco?.localDeEntrega
              ),
              referencia: myOrder.cliente?.endereco?.pontoDeReferencia,
              bairro: bairroNome,
              taxa: entregaGratis ? 3 : myOrder.taxaEntrega,
            }
          : null,
        historico: [{ tipo: "enviado", data: new Date() }],
        pagamento: myOrder.pagamentos,
      };

      const { data } = await axios.post<any>(`${api_url}/pedidos`, order, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const { data } = (await fetch(`${env.apiURL}/pedidos`, {
      //   method: "POST",
      //   body: JSON.stringify(order),
      //   headers: { "Content-Type": "application/json" },
      // })) as unknown as { data: { id: string } };

      // console.log(data)
      if (data?.id) {
        setId(data.id);
      }
    };

    const whatsAppLink = encodeURI(
      // `https://api.whatsapp.com/send?${
      `https://wa.me/${
        env.whatsapp ? `${env.whatsapp}?` : ""
        // env.whatsapp ? `phone=${env.whatsapp}&` : ""
      }text=${`${customer.replace(/;/g, "*")}`}${
        address.replace(" ", "").length
          ? `
  
  ${address}`
          : ""
      }${
        items.replace(" ", "").length
          ? `
  
  ${items.replace(/ --/g, " _").replace(/-- /g, "_ ")}`
          : ""
      }${
        payment.replace(" ", "").length
          ? `
  
  ${payment}`
          : ""
      }`
        .replace(/---/g, "*")
        .replace(/--/g, "_")
    );

    try {
      if (tries >= 3) throw new Error("Numero de tentativas excedidas");
      setLoading(true);
      setTries((prev) => prev + 1);
      await sendOrder();
      // window.open(whatsAppLink, "_blank");
      const isDev = localStorage.getItem("dev");
      if (!isDev) {
        window.open(whatsAppLink, "_self");
      } else {
        newOrder();
        router.push("/pedido");
      }
      setLoading(false);
    } catch (err: unknown) {
      if (tries < 3) {
        confirm();
      } else {
        if ((err as Error)?.message) {
          console.error((err as Error).message, (err as Error).stack);
        } else {
          console.error(JSON.stringify(err));
        }
        setLoading(false);

        // window.open(whatsAppLink, "_blank");
        window.open(whatsAppLink, "_self");
      }
    }
  };

  // if (!myOrder || !myOrder.cliente?.nome || !myOrder.cliente?.whatsapp)
  //   return <ConfirmacaoStyle>

  //   </ConfirmacaoStyle>;
  if (loading) return <Loading />;
  return (
    <ConfirmacaoStyle>
      {myOrder.id ? (
        <TextContainer title="Pronto! Você enviou seu pedido!" />
      ) : !!myOrder.cliente?.nome && !!myOrder.cliente?.whatsapp ? (
        <TextContainer
          title="CONFIRMAÇÃO"
          subtitle="CONFIRME OS DADOS ANTES DE ENVIAR AO NOSSO WHATSAPP"
          description="*Podem haver alterações nos valores. Ao enviar, aguarde a confirmação
          dos nossos atendentes!*"
        />
      ) : (
        <>
          {" "}
          <TextContainer
            title="VOLTAR PARA A TELA INICIAL"
            subtitle="Retorne à tela inicial para fazer um pedido!"
          />
        </>
      )}

      {!!myOrder.cliente?.nome && !!myOrder.cliente?.whatsapp ? (
        <div className="menu">
          <Info name="Cliente" value={customer.replace(/;/g, "")} />
          {!!myOrder && ehEntrega && <Info name="Endereço" value={address} />}
          <Info name="Itens" value={items.replace(/-- | --/g, "")} />
          <Info name="Total" value={total} />
          <Info name="Pagamento" value={payment} />
        </div>
      ) : (
        <h1 className="icon-center">🍕</h1>
      )}

      {myOrder.id ? (
        <BottomControls
          secondaryButton={{
            click: () => {
              newOrder();
              router.push("/pedido");
            },
            text: "QUERO FAZER MAIS UM PEDIDO!",
          }}
        />
      ) : !!myOrder.cliente?.nome && !!myOrder.cliente?.whatsapp ? (
        <BottomControls
          backButton
          primaryButton={{
            click: confirm,
            text: "ENVIAR PARA A PIZZARIA",
          }}
        />
      ) : (
        <BottomControls
          primaryButton={{
            click: () => {
              newOrder();
              router.push("/pedido");
            },
            text: "VOLTAR PARA A TELA INICIAL",
          }}
        />
      )}
    </ConfirmacaoStyle>
  );
};

export default Confirmacao;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    let bairroNome = "";

    if (ctx.query.bairro) {
      const bairros = await (
        await fetch(`${env.apiURL}/bairros?id=${ctx.query.bairro}`, {
          headers: { "Content-Type": "application/json" },
        })
      ).json();

      bairroNome = "NÃO ENCONTRADO";

      try {
        bairroNome = bairros[0].nome;
      } catch {
        console.error("bairro não encontrado");
      }
    }

    return {
      props: {
        api_url: env.apiURL,
        bairroNome,
      },
    };
  } catch (err) {
    console.error((err as Error).message, (err as Error).stack);
    return {
      redirect: {
        destination: "/pedido",
        permanent: false,
      },
    };
  }
};
