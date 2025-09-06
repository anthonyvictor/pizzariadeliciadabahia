import { useEffect, useState } from "react";
import styled from "styled-components";
import { NumberInput } from "./NumberInput";
import {
  ChecklistHeader,
  ChecklistItemInfo,
  checklistSearchFilter,
  ChecklistStyle,
  groupItems,
  GroupStyle,
  IChecklistBase,
  IChecklistItem,
  IChecklistItemGroup,
} from "./Checklist";
import { CgChevronDoubleRight, CgChevronRight } from "react-icons/cg";
import Image from "next/image";
import { X } from "@upstash/redis/zmscore-CgRD7oFR";

export const MultiChecklist = ({
  name,
  label,
  description,
  min = 0,
  max = 10000000000000,
  items,
  value,
  setValue,
  search: goSearch,
  onDone,
  collapsed: _collapsed,
  maxItemsCollapsed,
  collapsedLabel,
}: IChecklistBase & {
  min?: number;
  max?: number;
  value: string[];
  setValue: (newValues: string[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(_collapsed);

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
        key={item.id}
        className={`checklist-item`}
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
        {item.disabled ? (
          <h5>Em falta</h5>
        ) : (
          <NumberInput
            value={value.filter((x) => x === item.id)?.length ?? 0}
            setValue={(novoValor) => {
              const prev = [...value].filter((x) => x !== item.id);
              prev.push(...new Array(novoValor).fill(item.id));
              setValue(prev);
              if (prev.length === max) {
                setCollapsed(true);
                onDone?.();
              }
            }}
            beforeUp={(novoValor) =>
              value.filter((x) => x !== item.id).length + novoValor <= max
            }
            beforeDown={(novoValor) =>
              value.filter((x) => x !== item.id).length + novoValor >= 0
            }
          />
        )}
      </li>
    );
  };
  const isDone = value.length === max;

  return (
    <MultiChecklistStyle checked={!!value} id={`checklist-${name}`}>
      <ChecklistHeader
        label={label}
        description={description}
        currMax={{ curr: value.length, max }}
        checked={value.length >= min}
        required={min > 0}
        s={goSearch ? { search, setSearch } : undefined}
      />
      <ul>
        {(isDone && collapsed
          ? groupItems(items.filter((x) => value.includes(x.id)))
          : collapsed
          ? groupItems(
              checklistSearchFilter(items, search).slice(
                0,
                maxItemsCollapsed ?? 3
              )
            )
          : groupItems(checklistSearchFilter(items, search))
        ).map((gi) => {
          return "items" in gi ? (
            <Group key={gi.name} group={gi} />
          ) : (
            <Item key={gi.id} item={gi} />
          );
        })}
      </ul>
      {collapsed && (
        <button className="show-more" onClick={() => setCollapsed(false)}>
          {collapsedLabel ?? "Mostrar mais itens..."}
        </button>
      )}
    </MultiChecklistStyle>
  );
};

const MultiChecklistStyle = styled(ChecklistStyle).attrs(
  (props: { checked: boolean }) => props
)`
  ul {
    li {
    }
  }
`;
