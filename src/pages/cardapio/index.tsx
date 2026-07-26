import { GetStaticProps, NextPage } from "next";
import { IPizzaSabor, IPizzaTamanho } from "tpdb-lib";
import { formatCurrency, getValueString } from "@util/format";
import { obterTamanhos } from "@routes/pizzas/tamanhos";
import { obterSabores } from "@routes/pizzas/sabores";
import { dvEst } from "@models/deveEstar";
import React, { useState } from "react";
import {
  CardapioContainer,
  HeaderSection,
  SectionTitle,
  SizesSlider,
  SizeCard,
  CalculationNotice,
  SearchAndFilter,
  FlavorsGrid,
  FlavorCard,
} from "@styles/pages/cardapio/styles";

export interface IPizzaValor {
  tamanhoId: string;
  valor: number;
}

export interface IPizzaSaborIngr {
  id: string;
  nome: string;
}

export interface IRegra {
  id: string;
  descricao: string;
}

export interface IDado {
  chave: string;
  valor: string;
}

interface CardapioProps {
  sabores: IPizzaSabor[];
  tamanhos: IPizzaTamanho[];
}

const Cardapio: NextPage<CardapioProps> = ({ sabores = [], tamanhos = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const visibleSizes = tamanhos.filter((t) => t.visivel);
  const disponibleSizes = tamanhos.filter((t) => t.visivel && t.disponivel);

  const filteredSabores = sabores.filter(
    (sabor) =>
      sabor.visivel &&
      (sabor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sabor.descricao?.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <CardapioContainer>
      <HeaderSection>
        <h1>Nosso Cardápio</h1>
        <p>
          Aquela pizza no capricho, gostosa e bem recheada que você respeita. É
          Daquele jeitinho que só a gente faz na pegada baiana né, pai? 😉
        </p>
      </HeaderSection>

      {disponibleSizes.length > 1 && (
        <>
          <SectionTitle>Tamanhos:</SectionTitle>
          <SizesSlider>
            {visibleSizes.map((tam) => (
              <SizeCard key={tam.id || tam.nome}>
                <div className="header">
                  <span className="name">{tam.nome}</span>
                  <span className="fatias">{tam.fatias} Fatias</span>
                </div>
                <div className="details">
                  <span>
                    Até {tam.maxSabores} sabor{tam.maxSabores > 1 ? "es" : ""}
                  </span>
                  <span>Aprox. {tam.tamanhoAprox} cm</span>
                </div>
              </SizeCard>
            ))}
          </SizesSlider>
        </>
      )}

      <CalculationNotice>
        * O valor final da pizza é calculado pela <b>média simples</b> dos
        sabores selecionados.
      </CalculationNotice>

      {disponibleSizes.length > 1 && <SectionTitle>Sabores:</SectionTitle>}
      <SearchAndFilter>
        <input
          type="text"
          placeholder="Buscar sabor ou ingrediente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchAndFilter>

      <FlavorsGrid>
        {filteredSabores.map((sabor) => (
          <FlavorCard key={sabor.id}>
            <div className="image-wrapper">
              {sabor.imagemUrl ? (
                <img src={sabor.imagemUrl} alt={sabor.nome} loading="lazy" />
              ) : (
                <div className="placeholder">🍕</div>
              )}
              {sabor.vendidos > 50 && (
                <span className="badge-bestseller">Mais Pedido</span>
              )}
            </div>

            <div className="content">
              <h3>{sabor.nome}</h3>
              <p>{sabor.descricao || "Sem descrição disponível."}</p>
            </div>

            <div className="prices-container">
              {sabor.valores
                .map((v) => {
                  const tam = (
                    disponibleSizes.length > 1 ? visibleSizes : disponibleSizes
                  ).find((x) => x.id === v.tamanhoId);
                  if (!tam) return null;
                  return (
                    <div key={v.tamanhoId} className="price-tag">
                      <span className="size-name">{tam.nome.slice(0, 3)}:</span>
                      <span className="price-value">
                        {formatCurrency(v.valor)}
                      </span>
                    </div>
                  );
                })
                .filter(Boolean)}
            </div>
          </FlavorCard>
        ))}
      </FlavorsGrid>
    </CardapioContainer>
  );
};

export default Cardapio;

// export const getStaticProps: GetStaticProps = async () => {
//   try {
//     const sabores = await obterSabores({
//       _pedido: null,
//       deveEstar: dvEst.visivel,
//     });

//     const tamanhos = await obterTamanhos({
//       _pedido: null,
//       sabores,
//       deveEstar: dvEst.visivel,
//     });

//     return {
//       props: {
//         sabores,
//         tamanhos,
//       },
//       revalidate: 10,
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: {
//         sabores: [],
//         tamanhos: [],
//       },
//       revalidate: 10,
//     };
//   }
// };

export const getStaticProps: GetStaticProps = async () => {
  try {
    const sabores = await obterSabores({
      _pedido: null,
      deveEstar: dvEst.visivel,
    });

    const tamanhos = await obterTamanhos({
      _pedido: null,
      sabores,
      deveEstar: dvEst.visivel,
    });

    // 🔥 Torna tudo serializável (converte Date → string, BigInt → number, etc)
    const saboresSerializaveis = JSON.parse(JSON.stringify(sabores));
    const tamanhosSerializaveis = JSON.parse(JSON.stringify(tamanhos));

    return {
      props: {
        sabores: saboresSerializaveis,
        tamanhos: tamanhosSerializaveis,
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
