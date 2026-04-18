import {
  IData,
  IDia,
  IPeriodoData,
  IPeriodoDia,
  IPeriodoHorario,
} from "tpdb-lib";
import { dateOrNull } from "./conversion";

export function entreHorarios(_h: Date, periodos: IPeriodoHorario[]): boolean {
  const h = new Date(_h);
  const minutosHorario = h.getHours() * 60 + h.getMinutes();

  return periodos.some(({ de, ate }) => {
    const inicio = de.h * 60 + (de.m ?? 0);
    const fim = ate.h * 60 + (ate.m ?? 0);

    // Se início == fim, considera período como "dia inteiro"
    if (inicio === fim) return true;

    // Lida com faixas que cruzam meia-noite (ex: 22:00 → 02:00)
    if (fim < inicio) {
      return minutosHorario >= inicio || minutosHorario <= fim;
    }

    return minutosHorario >= inicio && minutosHorario <= fim;
  });
}

function toDate(data: IData): Date {
  return new Date(data.y, data.m - 1, data.d);
}

function toIData(date: Date): IData {
  return {
    y: date.getFullYear(),
    m: date.getMonth() + 1, // JS usa 0-11
    d: date.getDate(),
  };
}

export function entreDatas(d: Date, datas: IData[]): boolean {
  const target = toIData(d);

  return datas.some(
    ({ y, m, d }) => y === target.y && m === target.m && d === target.d,
  );
}

export function entrePeriodosDatas(d: Date, periodos: IPeriodoData[]): boolean {
  const t = d.getTime();

  return periodos.some((p) => {
    const start = toDate(p.de).getTime();
    const end = toDate(p.ate).getTime();

    return t >= Math.min(start, end) && t <= Math.max(start, end);
  });
}

export function entreDias(d: Date, dias: IDia[]): boolean {
  // getDay: 0 = domingo, 6 = sábado
  const diaSemana = d.getDay() === 0 ? 1 : d.getDay() + 1; // 1 = domingo, 7 = sábado

  return dias.includes(diaSemana);
}

export function entrePeriodosDias(d: Date, periodos: IPeriodoDia[]): boolean {
  // getDay retorna 0 = domingo … 6 = sábado → ajustamos para 1–7
  const diaSemana: IDia = d.getDay() === 0 ? 1 : d.getDay() + 1;

  return periodos.some(({ de, ate }) => {
    if (de <= ate) {
      // Ex: 2 → 6 (segunda até sexta)

      return diaSemana >= de && diaSemana <= ate;
    } else {
      // Ex: 5 → 2 (quinta até segunda, passando pelo domingo)

      return diaSemana >= de || diaSemana <= ate;
    }
  });
}

export const ehNiver = (_dataNasc) => {
  const dataNasc = dateOrNull(_dataNasc);
  if (!dataNasc) return false;
  const hoje = new Date();

  return (
    dataNasc.getDate() === hoje.getDate() &&
    dataNasc.getMonth() === hoje.getMonth()
  );
};

type TimeUnit =
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "minutes"
  | "seconds";

export function dateDiff(_date1: Date, _date2: Date, unit: TimeUnit): number {
  // garante que d1 <= d2
  const date1 = new Date(_date1);
  const date2 = new Date(_date2);
  const [d1, d2] =
    date1.getTime() <= date2.getTime() ? [date1, date2] : [date2, date1];
  const msDiff = d2.getTime() - d1.getTime(); // já não precisa de Math.abs

  switch (unit) {
    case "seconds":
      return Math.floor(msDiff / 1000);
    case "minutes":
      return Math.floor(msDiff / (1000 * 60));
    case "hours":
      return Math.floor(msDiff / (1000 * 60 * 60));
    case "days":
      return Math.floor(msDiff / (1000 * 60 * 60 * 24));
    case "weeks":
      return Math.floor(msDiff / (1000 * 60 * 60 * 24 * 7));
    case "months": {
      const years = d2.getFullYear() - d1.getFullYear();
      const months = d2.getMonth() - d1.getMonth();
      return years * 12 + months;
    }
    case "years":
      return d2.getFullYear() - d1.getFullYear();
    default:
      throw new Error(`Unidade inválida: ${unit}`);
  }
}

export function getDuracao(_dataInic: Date) {
  let dataInic = new Date(_dataInic);
  let dataATUAL = new Date();

  let ms = dataATUAL.getTime() - dataInic.getTime();

  let m = ms / 1000 / 60;

  let h = m / 60;

  m = (h % 1) * 60;

  let d = h / 24;

  let dur = d < 1 ? "" : Math.floor(d) + "d";

  if (dur === "") {
    dur = h < 1 ? "" : Math.floor(h) + "h";
    if (dur === "") {
      dur = Math.floor(m) + "m";
    } else {
      dur = dur + Math.floor(m);
    }
  }
  return dur;
}

export function getDuracaoCor(_dataInic: Date, fundoEscuro?: boolean) {
  let dataInic = new Date(_dataInic);

  if (!dataInic) return "#000";
  let dataAtual = new Date();
  let diff = (dataAtual.getTime() - dataInic.getTime()) / 1000 / 60;

  if (diff < 10) {
    return "#02fa3c";
  } else if (diff < 20) {
    return "#a3d609";
  } else if (diff < 30) {
    return "#fff700";
  } else if (diff < 40) {
    return "#fcb01e";
  } else if (diff < 50) {
    return fundoEscuro ? "#fa7039" : "#fa5311";
  } else if (diff < 60) {
    return fundoEscuro ? "#db2c23" : "#bf0f06";
  } else if (diff < 120) {
    return fundoEscuro ? "#cc275b" : "#99032b";
  } else if (diff <= 150) {
    return fundoEscuro ? "#dfa9fc" : "#8108c2";
  } else {
    return fundoEscuro ? "#7b5094" : "#17091f";
  }
}
