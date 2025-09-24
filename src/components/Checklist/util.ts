import { removeAccents } from "@util/format";
import { GroupOrItem, IChecklistItem, IChecklistItemGroup } from "./types";

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
