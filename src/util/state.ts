import { SetState } from "@config/react";

export function upsertArray(item: any, setArray: SetState<any[]>, data: any) {
  setArray((_prev) => {
    const prev = [..._prev];
    const i = prev.findIndex((x) => x.id === item.id);

    if (i > -1) {
      prev[i] = { ...item, ...data };
    }

    return prev;
  });
}
