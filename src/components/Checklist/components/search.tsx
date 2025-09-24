import { useEffect, useState } from "react";
import { useChecklist } from "../context";
import { ChecklistSearchStyle } from "../styles";
import { CgClose, CgSearch } from "react-icons/cg";

export const ChecklistSearch = () => {
  const { search, setSearch, showSearch, setShowSearch, name } = useChecklist();
  const blur = () => {
    if (!search.replaceAll(" ", "").trim()) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSearch) {
      timer = setTimeout(() => {
        blur();
      }, 1000 * 7); // segundos
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showSearch, search]);

  return (
    <ChecklistSearchStyle>
      {showSearch ? (
        <div className="input-close">
          <input
            autoFocus
            id={`search-input-${name}`}
            value={search}
            placeholder="Pesquise por um item..."
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => blur()}
          />
          <button
            onClick={() => {
              setSearch("");
              setShowSearch(false);
            }}
          >
            <CgClose />
          </button>
        </div>
      ) : (
        <button
          disabled={showSearch || !!search}
          onClick={() => setShowSearch(true)}
        >
          <CgSearch />
        </button>
      )}
    </ChecklistSearchStyle>
  );
};
