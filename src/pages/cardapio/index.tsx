import { GetStaticProps, NextPage } from "next";
import { CardapioStyle } from "@styles/pages/cardapio/styles";
import { ICardapio } from "@models/cardapio";
import { IPizzaSabor, IPizzaGrupo, IPizzaTamanho } from "@models/pizza";
import { getValueString } from "@util/format";
import { Sabor } from "@components/cardapio/sabor";
import { env } from "@config/env";

const Cardapio: NextPage<ICardapio> = ({ sizes, groupsLeft, groupsRight }) => {
  const getAllValues = (s: IPizzaSabor) => {
    return s.valores
      .filter((x) => {
        const tam = sizes.find((t) => t.id === x.tamanhoId && t.visivel);

        return !!tam;
      })
      .map((v) =>
        getValueString({
          value: v.valor - 0.01,
          name: sizes.find((x) => x.id === v.tamanhoId).nome.slice(0, 3),
        })
      )
      .join(" • ");
  };

  const getGroups = (g: IPizzaGrupo) => (
    <div className="group" key={g.nome}>
      <h2 className="group-name">{g.nome}</h2>
      <div className="group-flavours">
        {g.sabores.map((s) => (
          <Sabor
            key={s.nome}
            nome={s.nome}
            ingredientes={s.ingredientes}
            active={s.disponivel}
            valuesString={getAllValues(s)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <CardapioStyle>
      <div className="sizes">
        {sizes
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
      <div className="groups">
        <aside className="groups-left">
          {groupsLeft.map((g) => getGroups(g))}
        </aside>
        <aside className="groups-right">
          {groupsRight.map((g) => getGroups(g))}
        </aside>
      </div>
    </CardapioStyle>
  );
};

export default Cardapio;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const sizes = ((await (
      await fetch(`${env.apiURL}/pizzas/tamanhos`)
    ).json()) ?? []) as IPizzaTamanho[];

    const grupos = ((await (
      await fetch(`${env.apiURL}/pizzas/sabores`, {
        headers: { "Content-Type": "application/json" },
      })
    ).json()) ?? []) as IPizzaGrupo[];

    const groupsLeft = [];
    const groupsRight = [];

    grupos.forEach((g: IPizzaGrupo) => {
      grupos.indexOf(g) % 2 === 0 ? groupsLeft.push(g) : groupsRight.push(g);
    });

    return {
      props: {
        sizes,
        groupsLeft,
        groupsRight,
      },
      revalidate: 10,
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        sizes: [],
        groupsLeft: [],
        groupsRight: [],
      },
      revalidate: 10,
    };
  }
};
