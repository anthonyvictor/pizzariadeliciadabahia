import { formatCurrency } from "@util/format";
import { ChecklistItemInfoStyle } from "../styles";
import { IChecklistItem } from "../types";

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

      <b
        style={{
          fontSize: "0.7rem",
          opacity: !item.oldPrice && !item.price && !item.minPrice ? "0" : "1",
        }}
      >
        {item.minPrice != null
          ? `À partir de ${formatCurrency(item.minPrice)}`
          : item.price != null
          ? item.isSum && item.price === 0
            ? "+R$ 0,00"
            : `${item.isSum && item.price >= 0 ? "+" : ""}${formatCurrency(
                item.price
              )}`
          : "+R$ 0,00"}
      </b>
      {item.oldPrice && item.oldPrice > item.price && (
        <i className="old-price">{formatCurrency(item.oldPrice)}</i>
      )}
    </ChecklistItemInfoStyle>
  );
};
