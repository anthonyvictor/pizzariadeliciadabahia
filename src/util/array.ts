export function toArray<T>(_arr: T | T[]) {
  if (!_arr) return [];
  const arr = Array.isArray(_arr) ? _arr : [_arr];
  return arr;
}

// Função auxiliar para acessar subcampos
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function agrupar<T>(arr: T[], props: string[]): T[][] {
  const map = new Map<string, T[]>();

  for (const item of arr) {
    // Cria chave a partir dos paths escolhidos
    const chave = props
      .map((prop) => String(getNestedValue(item, prop)))
      .join("|");

    if (!map.has(chave)) {
      map.set(chave, []);
    }

    map.get(chave)!.push(item);
  }

  return Array.from(map.values());
}

export function sortDisp<T>(arr: T[]) {
  const disp = (x: T) =>
    x["disponivel"] && x["visivel"] && x["emCondicoes"] && x["estoque"] !== 0
      ? 1
      : 0;

  return [...arr].sort((a, b) => {
    return disp(b) - disp(a); // os "true" vão para o topo
  });
}

export const sortByDate = (a, b) => {
  if (!a && !b) return 0; // ambos undefined
  if (!a) return 1; // a undefined → vem depois
  if (!b) return -1; // b undefined → vem depois
  return new Date(b).getTime() - new Date(a).getTime();
};
