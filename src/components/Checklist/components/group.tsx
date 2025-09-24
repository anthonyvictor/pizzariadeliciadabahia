import { CgChevronRight } from "react-icons/cg";
import { GroupStyle } from "../styles";
import { Item } from "./item";
import { IChecklistItemGroup } from "../types";

export const Group = ({ group }: { group: IChecklistItemGroup }) => {
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
