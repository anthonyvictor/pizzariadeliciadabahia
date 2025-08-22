import { GetStaticProps, NextPage } from "next";
import { CardapioStyle } from "@styles/pages/cardapio/styles";
import { IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import { formatCurrency, getValueString } from "@util/format";
import { obterTamanhos } from "@routes/pizzas/tamanhos";
import { obterSabores } from "@routes/pizzas/sabores";

const Cardapio: NextPage = ({
  sabores,
  tamanhos,
}: {
  sabores: IPizzaSabor[];
  tamanhos: IPizzaTamanho[];
}) => {
  const getAllValues = (s: IPizzaSabor) => {
    return s.valores
      .filter((x) => {
        const tam = tamanhos.find((t) => t.id === x.tamanhoId && t.visivel);

        return !!tam;
      })
      .map((v) =>
        getValueString({
          value: v.valor - 0.01,
          name: tamanhos.find((x) => x.id === v.tamanhoId).nome.slice(0, 3),
        })
      )
      .join(" • ");
  };

  return (
    <CardapioStyle>
      <div className="sizes">
        {tamanhos
          .filter((x) => x.visivel)
          .map((s) => (
            <li key={s.nome} className="size">
              <label>
                {s.nome} - {s.fatias} Fatias
              </label>
              <div className="info">
                <label>
                  Até {s.maxSabores} sabor{s.maxSabores > 1 && "es"}
                </label>
                <label>Aprox. {s.tamanhoAprox}cm</label>
              </div>
            </li>
          ))}
      </div>
      <p className="value-detail">
        * O valor da pizza será calculado pelo <b>valor médio</b> dos sabores
        escolhidos*
      </p>
      {/* <div className="groups">
        <aside className="groups-left">
          {groupsLeft.map((g) => getGroups(g))}
        </aside>
        <aside className="groups-right">
          {groupsRight.map((g) => getGroups(g))}
        </aside>
      </div> */}
      <ul>
        {sabores.map((sabor) => (
          <li key={sabor.id}>
            <h1>{sabor.nome}</h1>
            <p>{sabor.descricao}</p>
            <small>
              {sabor.valores
                .map((v) => {
                  const nome = tamanhos.find((x) => x.id === v.tamanhoId)?.nome;

                  return nome
                    ? `${nome.slice(0, 3)}: ${formatCurrency(v.valor)}`
                    : "";
                })
                .filter(Boolean)
                .join(" - ")}
            </small>
          </li>
        ))}
      </ul>
    </CardapioStyle>
  );
};

export default Cardapio;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const sabores = await obterSabores({
      _cliente: null,
      deveEstar: "visivel",
    });

    const tamanhos = await obterTamanhos({
      _cliente: null,
      sabores,
      deveEstar: "visivel",
    });

    return {
      props: {
        sabores,
        tamanhos,
      },
      revalidate: 10,
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        sabores: [],
        tamanhos: [],
      },
      revalidate: 10,
    };
  }
};
