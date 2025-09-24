import { ChecklistHeader } from "./components/header";
import { ChecklistStyle } from "./styles";
import { IChecklist } from "./types";
import { ChecklistProvider, useChecklist } from "./context";
import { Item } from "./components/item";
import { Group } from "./components/group";

export const Checklist = (props: IChecklist) => {
  return (
    <ChecklistProvider {...props}>
      <ChecklistComponent />
    </ChecklistProvider>
  );
};

const ChecklistComponent = () => {
  const {
    name,
    items,
    value,
    collapsed,
    setCollapsed,
    collapsedLabel,
    maxItemsCollapsed,
    isDone,
    finalItems,
  } = useChecklist();

  return (
    <ChecklistStyle checked={!!value} id={`checklist-${name}`}>
      <ChecklistHeader />
      <ul id={`checklist-ul-${name}`}>
        {finalItems.map((gi) => {
          return "items" in gi ? (
            <Group key={gi.name} group={gi} />
          ) : (
            <Item key={gi.id} item={gi} />
          );
        })}
      </ul>
      {collapsed &&
        items.length > 1 &&
        (isDone || (!isDone && items.length > maxItemsCollapsed)) && (
          <button className="show-more" onClick={() => setCollapsed(false)}>
            {collapsedLabel ?? "Mostrar mais opções..."}
          </button>
        )}
    </ChecklistStyle>
  );
};
