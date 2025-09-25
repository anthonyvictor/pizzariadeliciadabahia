import { api } from "@util/axios";
import { formatCurrency } from "@util/format";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { ICombo, IHome } from "tpdb-lib";

export const Stories = () => {
  const [stories, setStories] = useState<IHome>({
    combos: [],
    bebidas: [],
    tamanhos: [],
    lanches: [],
    cliente: undefined,
  });

  useEffect(() => {
    api
      .get("/pages/stories")
      .then((res) => {
        console.log(res.data);
        setStories(res.data);
      })
      .catch((err) => {
        toast.error("Erro!");
        console.error(err);
      });
  }, []);

  return (
    <StoriesStyle>
      <VerticalCarousel
        combos={[
          {
            imagemUrl: `https://iili.io/K0HP5zb.md.png`,
            nome: "Promoções de hoje",
            descricao: "Confira nossas promoções!",
          } as ICombo,
          ...stories.combos,
        ]}
        autoPlayInterval={3000}
      />
      {/* <ul className="no-scroll">
        {combos.map((combo, i) => {
          const isActive = i === 1;
          return (
            <li className={isActive ? `active` : undefined} key={combo.id}>
              <div className="img">
                <Image src={combo.imagemUrl} layout="fill" />
              </div>
              {isActive && (
                <div className="txt">
                  <h3>{combo.nome}</h3>
                  <h5>{combo.descricao}</h5>
                  <h5>à partir de {combo.valorMin}</h5>
                </div>
              )}
            </li>
          );
        })}
      </ul> */}
    </StoriesStyle>
  );
};

const StoriesStyle = styled.main`
  /* padding: 50px; */

  height: 100%;
  display: flex;
  flex-direction: column;
  /* padding: 10px 20px 0px 20px; */

  /* @keyframes shown {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      opacity: 1;
      height: auto;
    }
  }
  ul {
    overflow-y: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    li {
      display: flex;
      flex-direction: column;
      gap: 5px;
      opacity: 0.5;
      .img {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 10px;
        overflow: hidden;
        align-self: center;
      }
      .txt {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        color: #fff;
        animation: shown 0.5s ease-in-out;
      }
      &.active {
        opacity: 1;
        .img {
          width: 300px;
          height: 300px;
        }
        .txt {
        }
      }
    }
  } */
`;

type Props = {
  combos: ICombo[];
  autoPlayInterval?: number; // ms
};

export const VerticalCarousel: React.FC<Props> = ({
  combos,
  autoPlayInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const ticking = useRef(false);

  // Ajuste essa variável pra deixar o item principal maior/menor
  const ITEM_HEIGHT = "33vh"; // <--- experimente 55vh / 65vh se quiser outros visual

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const idx = Math.max(0, Math.min(index, combos.length - 1));
      const child = containerRef.current.children[idx] as
        | HTMLElement
        | undefined;
      if (child) {
        child.scrollIntoView({ behavior: "smooth", block: "center" });
        setCurrentIndex(idx);
      }
    },
    [combos.length]
  );

  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % combos.length;
    scrollToIndex(nextIndex);
  }, [currentIndex, combos.length, scrollToIndex]);

  const prev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + combos.length) % combos.length;
    scrollToIndex(prevIndex);
  }, [currentIndex, combos.length, scrollToIndex]);

  // autoplay: reinicia sempre que currentIndex mudar
  useEffect(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => {
      next();
    }, autoPlayInterval);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [currentIndex, next, autoPlayInterval]);

  // calcula o item mais próximo do centro do container
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const c = containerRef.current!;
      const containerRect = c.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;
      let closestIndex = 0;
      let closestDist = Infinity;
      Array.from(c.children).forEach((child, i) => {
        const rect = (child as HTMLElement).getBoundingClientRect();
        const childCenter = rect.top + rect.height / 2;
        const dist = Math.abs(childCenter - centerY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      if (closestIndex !== currentIndex) {
        setCurrentIndex(closestIndex);
      }
      ticking.current = false;
    });
  }, [currentIndex]);

  // reinicia autoplay quando usuário interage (roda, toca, clique)
  const onUserInteraction = useCallback(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    // reiniciar timer (mesma lógica do efeito acima)
    autoTimer.current = setTimeout(() => {
      const nextIdx = (currentIndex + 1) % combos.length;
      scrollToIndex(nextIdx);
    }, autoPlayInterval);
  }, [currentIndex, combos.length, autoPlayInterval, scrollToIndex]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.addEventListener("wheel", onUserInteraction, { passive: true });
    c.addEventListener("touchstart", onUserInteraction, { passive: true });
    return () => {
      c.removeEventListener("wheel", onUserInteraction);
      c.removeEventListener("touchstart", onUserInteraction);
    };
  }, [onUserInteraction]);

  // índices de vizinhos (wrap-around)
  const prevIdx = (currentIndex - 1 + combos.length) % combos.length;
  const nextIdx = (currentIndex + 1) % combos.length;

  return (
    <Wrapper>
      <CarouselContainer
        ref={containerRef}
        onScroll={handleScroll}
        style={{ ["--item-height" as any]: ITEM_HEIGHT }}
        className="no-scroll"
      >
        {combos.map((combo, i) => {
          const isActive = i === currentIndex;
          const isNeighbor = i === prevIdx || i === nextIdx;
          return (
            <Item key={i} active={isActive} neighbor={isNeighbor}>
              <Card>
                <Img>
                  {/* 
                    USE ESTE FORMATO se estiver em Next 13+: 
                    <Image fill style={{ objectFit: 'cover' }} ... />
                    Se sua versão for antiga (layout="fill"), troque 'fill' por layout="fill" e objectFit="cover".
                  */}
                  <Image
                    src={combo.imagemUrl}
                    alt={combo.nome}
                    layout="fill"
                    // objectFit="cover"
                    sizes="(max-width: 600px) 90vw, 60vw"
                  />
                </Img>

                <Text>
                  {/* <h3 className="nome">{combo.nome}</h3> */}
                  <p className="descricao">{combo.descricao}</p>
                  {combo.valorMin && (
                    <h4 className="valor">
                      À partir de {formatCurrency(combo.valorMin)}
                    </h4>
                  )}
                </Text>
              </Card>
            </Item>
          );
        })}
      </CarouselContainer>

      {/* <Controls>
        <NavButton
          onClick={() => {
            prev();
            onUserInteraction();
          }}
        >
          ▲
        </NavButton>
        <NavButton
          onClick={() => {
            next();
            onUserInteraction();
          }}
        >
          ▼
        </NavButton>
      </Controls> */}

      {/* <Dots role="tablist" aria-label="combos">
        {combos.map((_, i) => (
          <Dot
            key={i}
            onClick={() => {
              scrollToIndex(i);
              onUserInteraction();
            }}
            aria-current={i === currentIndex}
            active={i === currentIndex}
          />
        ))}
      </Dots> */}
    </Wrapper>
  );
};

/* ---------------- styled ---------------- */

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  color: #fff;
`;

const CarouselContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* centraliza o item no container: padding = (viewport - itemHeight) / 2 */
  padding-top: calc((100% - var(--item-height)) / 2);
  padding-bottom: calc((100% - var(--item-height)) / 2);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
`;

const Item = styled.div<{ active?: boolean; neighbor?: boolean }>`
  height: var(--item-height);
  min-height: var(--item-height);
  width: 100%;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease;
  transform-origin: center;
  /* escala e opacidade diferentes: ativo > vizinho > oculto */
  transform: ${({ active, neighbor }) =>
    active ? "scale(1)" : neighbor ? "scale(0.6)" : "scale(0.4)"};
  opacity: ${({ active, neighbor }) => (active ? 1 : neighbor ? 0.5 : 0)};
  pointer-events: ${({ active, neighbor }) =>
    active || neighbor ? "auto" : "none"};
`;

const Card = styled.div`
  width: 80%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Img = styled.div`
  position: relative; /* obrigatório para Image fill/layout=fill */
  /* width: 100%; */
  height: calc(var(--item-height) * 1.2); /* imagem ocupa ~55% do item */
  aspect-ratio: 1/1;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const Text = styled.div`
  text-align: center;
  h2 {
    margin: 0 0 0.25rem 0;
    font-size: 1.6rem;
  }
  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const Controls = styled.div`
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  z-index: 10;
`;

const NavButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  cursor: pointer;
  font-size: 16px;
`;

const Dots = styled.div`
  position: absolute;
  bottom: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
`;

const Dot = styled.button<{ active?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${({ active }) => (active ? "black" : "#ddd")};
  padding: 0;
`;
