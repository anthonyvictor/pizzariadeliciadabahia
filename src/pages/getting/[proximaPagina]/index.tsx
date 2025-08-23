import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import Loading from "@components/loading";
import { useRouter } from "next/router";
import { sleep } from "@util/misc";

const ProximaPaginaPage: NextPage = ({
  proximaPagina,
}: {
  proximaPagina: string;
}) => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await sleep(1000);
      router.replace(`/${proximaPagina}`);
    })();
  }, []);

  return <Loading />;
};

export default ProximaPaginaPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      proximaPagina: ctx.query.proximaPagina,
    },
  };
};
