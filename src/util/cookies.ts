import { lerCookie, parseCookies } from "./api";
import { GetServerSidePropsContext } from "next";

export const obterCookies = (ctx: GetServerSidePropsContext) => {
  const cookies = parseCookies(ctx.req);

  const clienteId = lerCookie(cookies.clienteId);
  const pedidoId = lerCookie(cookies.pedidoId);

  return { clienteId, pedidoId };
};
