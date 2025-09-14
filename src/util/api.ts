// import { parse } from "cookie";
// import { setCookie } from "nookies";

export type RespType<T> = T | T[];

// export const parseCookies = (req: any) => {
//   const cookies = parse(req.headers.cookie || "");
//   return cookies;
// };

// // export const lerCookie = (cookie: string | undefined) => {
// //   if (!cookie) return null;

// //   const decoded = decodeURIComponent(cookie);
// //   const obj = JSON.parse(decoded ?? "{}");
// //   const res = !Object.keys(obj).length ? null : obj;
// //   return res;
// // };

// export const lerCookie = (cookie: string | undefined) => {
//   if (!cookie) return null;

//   const decoded = decodeURIComponent(cookie);

//   try {
//     // tenta fazer parse como JSON
//     const obj = JSON.parse(decoded);
//     // se for objeto vazio, retorna null
//     if (obj && typeof obj === "object" && !Object.keys(obj).length) {
//       return null;
//     }
//     return obj;
//   } catch {
//     // se não for JSON, retorna a string simples
//     return decoded;
//   }
// };

// type Segundos = number;
// /**
//  *
//  * @param maxAge Segundos em que vai expirar o cookie
//  */
// export const salvarCookie = (
//   nome: string,
//   obj: any,
//   res: any,
//   maxAge?: Segundos
// ) => {
//   const serialized = encodeURIComponent(
//     typeof obj === "string" ? obj : JSON.stringify(obj)
//   );

//   setCookie({ res }, nome, serialized, {
//     path: "/",
//     maxAge,
//     httpOnly: true,
//     sameSite: "lax", // importante no Vercel
//     secure: process.env.NODE_ENV === "production",
//   });
// };
