import { rolarEl } from "@util/dom";
import { GroupOrItem, IChecklist, IChecklistContext } from "./types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { checklistSearchFilter, groupItems } from "./util";

const ChecklistContext = createContext<IChecklistContext>(
  {} as IChecklistContext
);
export const ChecklistProvider = ({
  children,
  showZeroValue = true,
  highlights = [],
  items,
  maxItemsCollapsed = 3,
  name,
  value,
  min = 0,
  max = 1,
  collapsed: defaultCollapsed,
  ...rest
}: IChecklist & { children: ReactNode }) => {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [hideSearch, setHideSearch] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [touched, setTouched] = useState(false);
  const multi = min > 1 || max > 1;
  const required = min > 0;
  const isDone =
    value.length > 0 &&
    (max > 99 ? true : value.length === max) &&
    value.length >= min;

  const recentes =
    items.filter((x) => highlights.includes(x.id))?.length && !search
      ? ({
          items: items.filter((x) => highlights.includes(x.id)),
          name: "Recentes",
        } as GroupOrItem)
      : undefined;

  const finalItems =
    isDone && collapsed
      ? groupItems(items.filter((x) => value.includes(x.id)))
      : collapsed
      ? groupItems(
          checklistSearchFilter(items, search).slice(0, maxItemsCollapsed)
        )
      : [recentes, ...groupItems(checklistSearchFilter(items, search))].filter(
          Boolean
        );

  const allowSearch = items.length > 6;

  useEffect(() => {
    if (allowSearch && search) {
      setSearch("");
      const el = document.querySelector(
        `#search-input-${name}`
      ) as HTMLInputElement;
      if (el) {
        el.focus();
      }
    }
  }, [value]);

  useEffect(() => {
    if (allowSearch && search && value.length < max) {
      rolarEl(`checklist-ul-${name}`, {
        padding: -55,
        skipWait: true,
      });
    }
  }, [search]);

  useEffect(() => {
    if (value.length === max) {
      setHideSearch(true);
    } else {
      setHideSearch(false);
    }
  }, [value]);

  useEffect(() => {
    if (isDone && touched) {
      rolarEl(`checklist-${name}`, { skipWait: true });
    }
  }, [isDone, touched]);

  return (
    <ChecklistContext.Provider
      value={{
        ...rest,

        multi,
        required,
        isDone,
        touched,
        setTouched,
        showZeroValue,
        allowSearch,
        finalItems,
        items,
        maxItemsCollapsed,
        name,
        value,
        collapsed,
        defaultCollapsed,
        highlights,
        min,
        max,
        search,
        setSearch,
        setCollapsed,
        hideSearch,
        setHideSearch,
        showSearch,
        setShowSearch,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => useContext(ChecklistContext);
