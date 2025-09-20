import { useEffect, useState } from "react";
import styled from "styled-components";
import { NumberInput } from "./NumberInput";
import {
  ChecklistHeader,
  ChecklistItemInfo,
  checklistSearchFilter,
  ChecklistStyle,
  groupItems,
  GroupOrItem,
  GroupStyle,
  IChecklistBase,
  IChecklistItem,
  IChecklistItemGroup,
} from "./Checklist";
import { CgChevronDoubleRight, CgChevronRight } from "react-icons/cg";
import Image from "next/image";
import { X } from "@upstash/redis/zmscore-CgRD7oFR";
import { rolarEl } from "@util/dom";
import { array } from "zod";

export const MultiChecklist = ({
  name,
  label,
  description,
  min = 0,
  max = 10000000000000,
  items,
  highlights = [],
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
  highlights?: string[];
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
        onClick={(e) => {
          e.stopPropagation();
          const novoValor =
            (value.filter((x) => x === item.id)?.length ?? 0) + 1;
          if (value.filter((x) => x !== item.id).length + novoValor <= max) {
            const prev = [...value].filter((x) => x !== item.id);
            prev.push(...new Array(novoValor).fill(item.id));
            setValue(prev);
            if (prev.length === max) {
              setCollapsed(true);
              onDone?.();
            }
          }
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
        {item.disabled ? (
          <h5>Em falta</h5>
        ) : (
          <NumberInput
            // style={{ backgroundColor: "#00000050", borderRadius: 5 }}
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

  useEffect(() => {
    if (isDone) {
      rolarEl(`checklist-${name}`, true);
    }
  }, [isDone]);

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
          : _collapsed
          ? groupItems(
              checklistSearchFilter(items, search).slice(
                0,
                maxItemsCollapsed ?? 3
              )
            )
          : [
              highlights?.length && !search
                ? ({
                    items: items.filter((x) => highlights.includes(x.id)),
                    name: "Recentes",
                  } as GroupOrItem)
                : undefined,
              ...groupItems(checklistSearchFilter(items, search)),
            ]
        )
          .filter(Boolean)
          .map((gi, _, arr) => {
            return "items" in gi ? (
              <Group key={gi.name} group={gi} />
            ) : (
              <Item key={gi.id} item={gi} />
            );
          })}
      </ul>
      {collapsed && items.length > 1 && (
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
