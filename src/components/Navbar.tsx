import { useRef, useEffect, useState, createRef } from "react";

const sections = ["Menu 1", "Menu 2", "Menu 3"];

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navRef = useRef(null);
  const sectionRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  if (sectionRefs.current.length === 0) {
    sectionRefs.current = sections.map(() => createRef<HTMLDivElement>());
  }

  // Atualiza a posição da underline
  useEffect(() => {
    const nav = navRef.current;
    const activeButton = nav?.children[0]?.children[activeIndex];

    if (activeButton) {
      const { offsetLeft, offsetWidth } = activeButton;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeIndex]);

  // Scroll automático ao clicar nos botões
  const handleClick = (index) => {
    setActiveIndex(index);
    sectionRefs.current[index].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Detecta qual seção está visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find(
          (entry) => entry.isIntersecting && entry.intersectionRatio > 0.5
        );
        if (visibleEntry) {
          const index = sectionRefs.current.findIndex(
            (ref) => ref.current === visibleEntry.target
          );
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -60% 0px", // detecta mais precisamente a seção central
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Navegação */}
      <nav ref={navRef} className="sticky top-0 bg-white border-b z-10">
        <div className="flex space-x-4 px-4 py-2 relative">
          {sections.map((label, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`py-2 px-4 ${
                index === activeIndex
                  ? "text-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
          <span
            className="absolute bottom-0 h-[2px] bg-black transition-all duration-300"
            style={{
              ...underlineStyle,
              position: "absolute",
            }}
          />
        </div>
      </nav>

      {/* Seções */}
      <div className="space-y-20 px-4 pt-4">
        {sections.map((label, index) => (
          <div
            key={index}
            ref={sectionRefs.current[index]}
            className="min-h-[500px] scroll-mt-20"
          >
            <h2 className="text-2xl font-bold mb-4">{label}</h2>
            <p>Conteúdo da seção {label}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
