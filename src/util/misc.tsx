import jaroWinkler from "jaro-winkler";

export function sleep(time?: number) {
  return new Promise((resolve) => setTimeout(resolve, time ?? 200));
}

export function getPeriod(): {
  initialDate: Date;
  finalDate: Date;
} {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  if (currentHour >= 5 && currentHour) {
    const initialDate = new Date();
    initialDate.setHours(5);
    initialDate.setMinutes(0);
    initialDate.setSeconds(0);

    const finalDate = new Date();
    finalDate.setDate(finalDate.getDate() + 1);
    finalDate.setHours(4);
    finalDate.setMinutes(59);
    finalDate.setSeconds(59);

    return {
      initialDate,
      finalDate,
    };
  } else {
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() - 1);
    initialDate.setHours(5);
    initialDate.setMinutes(0);
    initialDate.setSeconds(0);

    const finalDate = new Date();
    finalDate.setHours(4);
    finalDate.setMinutes(59);
    finalDate.setSeconds(59);

    return {
      initialDate,
      finalDate,
    };
  }
}
export function startsWith(str: string, valuesToFind: Array<string>): boolean {
  return valuesToFind.some((value) => str.startsWith(value));
}

export const semelhanca = (str1: string, str2: string) => {
  return jaroWinkler(str1, str2);
};
