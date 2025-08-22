import { Footer } from "../footer";
import { useState } from "react";
import { Header } from "../header";
import Page from "../page";
import { LayoutStyle } from "./styles";

export default function Layout({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [closedUntil, setClosedUntil] = useState(undefined);

  // useEffect(() => {
  //     getClosedUntil()
  // }, [])

  // const getClosedUntil = async () => {
  //   const { closedUntil: _closedUntil } =
  //   (await (await fetch(`${env.apiURL}/loja`)).json()) ?? {closedUntil: null};
  //   setClosedUntil(_closedUntil ?? null)
  //   setIsLoaded(true)
  // }

  return (
    <LayoutStyle>
      <Header />
      <Page>{children}</Page>
      <Footer />
    </LayoutStyle>
  );
}
