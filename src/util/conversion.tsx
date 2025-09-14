import React from "react";

// export const FlagEmojiToPNG = (flag: string) => {
//   var reg = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/;
//   if (reg.test(flag)) {
//     var countryCode = Array.from(flag, (codeUnit: any) =>
//       codeUnit.codePointAt()
//     )
//       .map((char) => String.fromCharCode(char - 127397).toLowerCase())
//       .join("");
//     return (
//       <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
//     );
//   } else {
//     return flag;
//   }
// };

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function isImageUrl(url: string) {
  if (!/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) return false;

  return new Promise((resolve: (val: boolean) => void) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export const dateOrNull = (d: any): Date | undefined => {
  return d
    ? typeof d === "string" || typeof d === "object" || typeof d === "number"
      ? new Date(d)
      : undefined
    : undefined;
};
