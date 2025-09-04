import { NextRequest, NextResponse } from "next/server";
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname == "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  if (pathname == "/loja/app") {
    return NextResponse.redirect(new URL("/loja/app/home", req.url));
  }
  return NextResponse.next();
}
