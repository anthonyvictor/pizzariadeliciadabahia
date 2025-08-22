import { SetState } from "@config/react";
import { colors } from "@styles/colors";
import { formatCurrency, removeAccents } from "@util/format";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { CgChevronRight, CgClose, CgSearch } from "react-icons/cg";
import styled from "styled-components";
import { Checker } from "./checker";

export interface IChecklistItem {
  id: string;
  title: string;
  group?: string;
  imageUrl?: string;
  imageWidth?: string;
  imageFit?: "cover" | "scale-down";
  description?: string | ReactNode;
  price?: number;
  isSum?: boolean;
  minPrice?: number;
  disabled?: boolean;
}

interface ISearch {
  search: string;
  setSearch: SetState<string>;
}

export interface IChecklistBase {
  name: string;
  label: string;
  description?: string;
  items: IChecklistItem[];
  search?: boolean;
  showZeroValue?: boolean;
  onDone?: () => void;
}

export interface IChecklistItemGroup {
  name: string;
  items: IChecklistItem[];
}

export type GroupOrItem = IChecklistItem | IChecklistItemGroup;

export const groupItems = (items: IChecklistItem[]) => {
  const groupsOrItems: GroupOrItem[] = [];

  items.forEach((item) => {
    if (item.group) {
      const i = groupsOrItems.findIndex(
        (x) => "items" in x && x.name === item.group
      );
      if (i > -1) {
        (groupsOrItems[i] as IChecklistItemGroup).items.push(item);
      } else {
        groupsOrItems.push({ name: item.group, items: [item] });
      }
    } else {
      groupsOrItems.push(item);
    }
  });

  return groupsOrItems;
};

export const Checklist = ({
  name,
  label,
  description,
  required,
  items,
  value,
  setValue,
  search: goSearch,
  onDone,
  showZeroValue = true,
}: IChecklistBase & {
  required?: boolean;
  value: string | undefined;
  setValue: (newValue: string | undefined) => void;
}) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (goSearch && search) {
      setSearch("");
    }
  }, [value]);

  const Group = ({ group }: { group: IChecklistItemGroup }) => {
    return (
      <GroupStyle>
        <h3 className="group">
          <span>
            <CgChevronRight />
          </span>
          <span>{group.name}</span>
        </h3>
        {group.items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </GroupStyle>
    );
  };

  const Item = ({ item }: { item: IChecklistItem }) => {
    return (
      <li
        className={`checklist-item`}
        onClick={() => {
          setValue(item.id);
          onDone?.();
        }}
        style={{
          pointerEvents: item.disabled ? "none" : undefined,
          opacity: item.disabled ? "0.5" : undefined,
        }}
      >
        {!!item.imageUrl && (
          <div className="img" style={{ width: item.imageWidth ?? "50px" }}>
            <Image
              src={item.imageUrl}
              layout="fill"
              objectFit={item.imageFit ?? "cover"}
              priority
            />
          </div>
        )}
        <ChecklistItemInfo item={item} />
        <aside>
          <Checker checked={value === item.id} disabled={item.disabled} />
        </aside>
      </li>
    );
  };

  return (
    <ChecklistStyle checked={!!value} id={`checklist-${name}`}>
      <ChecklistHeader
        label={label}
        description={description}
        required={required}
        checked={!!value}
        s={goSearch ? { search, setSearch } : undefined}
      />
      <ul>
        {groupItems(checklistSearchFilter(items, search)).map((gi) =>
          "items" in gi ? (
            <Group key={gi.name} group={gi} />
          ) : (
            <Item key={gi.id} item={gi} />
          )
        )}
      </ul>
    </ChecklistStyle>
  );
};

export const GroupStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .group {
    display: flex;
    align-items: center;
    color: ${colors.elements};
    padding: 5px;
    gap: 5px;
    font-size: 0.8rem;
  }
`;
export const ChecklistHeader = ({
  label,
  description,
  required,
  checked,
  currMax,
  s,
}: {
  label: string;
  description: string;
  required: boolean;
  checked: boolean;
  currMax?: { curr: number; max: number };
  s: ISearch;
}) => {
  return (
    <ChecklistHeaderStyle checked={checked}>
      <div className="relative-container">
        <aside>
          <h4>{label}</h4>
          <small style={{ fontSize: "0.8rem" }}>{description}</small>
        </aside>
        <aside className="badge-search">
          {!!required && (
            <small className="badge">
              {checked
                ? `${currMax ? `${currMax.curr} / ${currMax.max} • ` : ""}Ok ✅`
                : `Obrig. ⚠️`}
            </small>
          )}
          {!!s && <ChecklistSearch search={s.search} setSearch={s.setSearch} />}
        </aside>
      </div>
    </ChecklistHeaderStyle>
  );
};

export const checklistSearchFilter = (
  items: IChecklistItem[],
  search: string
) => {
  const f = (x: string) => removeAccents(x.toLowerCase().replaceAll(" ", ""));
  const fSearch = f(search);
  return items.filter((x) =>
    search.replaceAll(" ", "").length ? f(x.title).includes(fSearch) : true
  );
};

const ChecklistSearch = ({
  search,
  setSearch,
}: {
  search?: string;
  setSearch?: SetState<string>;
}) => {
  const [show, setShow] = useState(false);

  const blur = () => {
    if (!search.replaceAll(" ", "").trim()) {
      setShow(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      timer = setTimeout(() => {
        blur();
      }, 1000 * 5); // 5 segundos
    }
    return () => {
      clearTimeout(timer);
    };
  }, [show, search]);

  return (
    <ChecklistSearchStyle>
      {show ? (
        <div className="input-close">
          <input
            autoFocus
            value={search}
            placeholder="Pesquise por um item..."
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => blur()}
          />
          <button
            onClick={() => {
              setSearch("");
              setShow(false);
            }}
          >
            <CgClose />
          </button>
        </div>
      ) : (
        <button disabled={show || !!search} onClick={() => setShow(true)}>
          <CgSearch />
        </button>
      )}
    </ChecklistSearchStyle>
  );
};
export const ChecklistItemInfo = ({
  item,
}: {
  item: Omit<IChecklistItem, "id">;
}) => {
  return (
    <ChecklistItemInfoStyle>
      <h5 className="title">{item.title}</h5>
      {typeof item.description === "string" ? (
        <small style={{ fontSize: "0.7rem" }} className="description">
          {item.description}
        </small>
      ) : (
        item.description
      )}
      <b style={{ fontSize: "0.7rem" }}>
        {item.minPrice != null &&
          `À partir de ${formatCurrency(item.minPrice)}`}
        {item.price != null
          ? item.isSum && item.price === 0
            ? ""
            : `${item.isSum ? "+" : ""}${formatCurrency(item.price)}`
          : ""}
      </b>
    </ChecklistItemInfoStyle>
  );
};

const ChecklistSearchStyle = styled.div`
  button {
    background-color: transparent;
    color: #fff;
    padding: 0 10px;
    border: none;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-close {
    display: flex;
    align-items: center;
    background-color: ${colors.backgroundDark};
    position: absolute;
    inset: 0;
    padding: 10px;

    input {
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #fff;
      flex: 1;
      color: #fff;
      &::placeholder {
        color: #ddd;
        font-style: italic;
        opacity: 1; /* Safari precisa disso */
      }
    }
  }
`;
const ChecklistHeaderStyle = styled.header.attrs(
  (props: { checked: boolean }) => props
)`
  position: sticky;
  top: 0;
  z-index: 10;
  color: #fff;
  background-color: ${colors.backgroundDark};
  display: flex;
  align-items: stretch;
  justify-content: stretch;

  .relative-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px;
    position: relative;
    flex: 1;
    .badge-search {
      display: flex;
      align-items: center;
      gap: 10px;
      .badge {
        background-color: ${({ checked }) =>
          checked ? colors.checkedLight : `#000`};
        color: ${({ checked }) => (checked ? `#000` : `#fff`)};
        font-weight: 800;
        border-radius: 10px;
        padding: 5px;
        font-size: 0.7rem;
      }
    }
  }
`;

const ChecklistItemInfoStyle = styled.aside`
  display: flex;
  flex-direction: column;
  flex: 1;
  .title {
  }
`;

export const ChecklistStyle = styled.section.attrs(
  (props: { checked: boolean }) => props
)`
  & > ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    min-height: 55px;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      border: none;
      border-bottom: 1px solid ${colors.backgroundDark}70;
      color: #fff;
      background-color: ${colors.backgroundDark}40;
      min-width: 0;
      gap: 5px;

      .img {
        height: 50px;
        position: relative;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid ${colors.backgroundDark};
        overflow: hidden;

        img {
          display: none;
          background-color: #fff;
          border-radius: 10px;
          transform: scale(101%);
        }
      }
    }
  }
`;
