import superjson from "superjson";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";

type PropsWithSuperjson<P> = { __superjson?: true; props: string; meta: any };

export function withSuperjsonGSSP<P>(
  gssp: GetServerSideProps<P>
): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext) => {
    const result = await gssp(ctx);

    if ("props" in result) {
      const serialized = superjson.serialize(result.props);
      return {
        props: {
          __superjson: true,
          props: serialized.json,
          meta: serialized.meta ?? null,
        },
      } as unknown as GetServerSidePropsResult<P>;
    }

    return result;
  };
}

// Higher Order Component para já desserializar no cliente
export function withSuperjsonPage<P>(PageComponent: React.ComponentType<P>) {
  return function WrappedPage(rawProps: any) {
    if (rawProps?.__superjson) {
      const deserialized = superjson.deserialize({
        json: rawProps.props,
        meta: rawProps.meta ?? null,
      }) as P;
      return <PageComponent {...deserialized} />;
    }
    return <PageComponent {...rawProps} />;
  };
}
