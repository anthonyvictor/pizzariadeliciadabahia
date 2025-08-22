import { IPeriodoData, IPeriodoHorario } from "tpdb-lib";

export function somenteData(d: Date): string {
  return new Date(d).toISOString().split("T")[0]; // Retorna no formato "YYYY-MM-DD"
}

export function algumaData(d: Date, datas: Date[]) {
  const _d = somenteData(d);

  return datas.some((x) => somenteData(x) == _d);
}

// Converte getDay (0–6) para (1–7)
export function diaDaSemanaNumero(_d: Date) {
  const d = new Date(_d);
  return d.getDay() === 0 ? 1 : d.getDay() + 1;
}

export function algumDiaDaSemanaNumero(d: Date, dias: number[]) {
  const _d = diaDaSemanaNumero(d);
  return dias.includes(_d);
}

/**
 * Verifica se um horário está dentro de algum dos períodos permitidos
 * @param h - Objeto Date com o horário a ser verificado
 * @param periodos - Array de períodos com início e fim (de, ate) em horas e minutos
 * @returns true se estiver dentro de qualquer período permitido
 */
export function entreHorarios(_h: Date, periodos: IPeriodoHorario[]): boolean {
  const h = new Date(_h);
  const minutosHorario = h.getHours() * 60 + h.getMinutes();

  return periodos.some(({ de, ate }) => {
    const inicio = de.h * 60 + (de.m ?? 0);
    const fim = ate.h * 60 + (ate.m ?? 0);

    // Lida com faixas que cruzam meia-noite (ex: 22:00 → 02:00)
    if (fim < inicio) {
      return minutosHorario >= inicio || minutosHorario < fim;
    }

    return minutosHorario >= inicio && minutosHorario < fim;
  });
}

/**
 * Verifica se uma data está dentro de algum dos períodos informados (desconsiderando horário)
 * @param d - A data a ser verificada
 * @param periodos - Lista de períodos com início e fim (Date)
 * @returns true se a data estiver dentro de algum dos períodos
 */
export function entreDatas(d: Date, periodos: IPeriodoData[]): boolean {
  // Normaliza a data para comparar só o dia (sem horário)
  const normalizar = (_d: Date) => {
    const d = new Date(_d);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  };

  const dataNormalizada = normalizar(d);

  return periodos.some(({ de, ate }) => {
    const inicio = normalizar(de);
    const fim = normalizar(ate);
    return dataNormalizada >= inicio && dataNormalizada <= fim;
  });
}
