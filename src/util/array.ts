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
