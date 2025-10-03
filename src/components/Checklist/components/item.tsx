import Image from "next/image";
import { ChecklistItemInfo } from "./info";
import { Checker } from "@components/checker";
import { useChecklist } from "../context";
import { IChecklistItem } from "../types";
import { NumberInput } from "@components/NumberInput";

export const Item = ({ item }: { item: IChecklistItem }) => {
  const { value, setValue, setCollapsed, onDone, multi, max, setTouched } =
    useChecklist();

  return (
    <li
      className={`checklist-item`}
      onClick={(e) => {
        e.stopPropagation();
        if (multi) {
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
        } else {
          setValue([item.id]);
          setCollapsed(true);
          onDone?.();
        }

        setTouched(true);
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

      {multi ? (
        <>
          {item.disabled ? (
            <h5>Indisp.</h5>
          ) : (
            <NumberInput
              style={{ flex: 0 }}
              value={value.filter((x) => x === item.id)?.length ?? 0}
              setValue={(novoValor) => {
                const prev = [...value].filter((x) => x !== item.id);
                prev.push(...new Array(novoValor).fill(item.id));
                setValue(prev);
                if (prev.length === max) {
                  setCollapsed(true);
                  onDone?.();
                }
                setTouched(true);
              }}
              beforeUp={(novoValor) =>
                value.filter((x) => x !== item.id).length + novoValor <= max
              }
              beforeDown={(novoValor) =>
                value.filter((x) => x !== item.id).length + novoValor >= 0
              }
            />
          )}
        </>
      ) : (
        <aside>
          <Checker checked={value?.[0] === item.id} disabled={item.disabled} />
        </aside>
      )}
    </li>
  );
};
