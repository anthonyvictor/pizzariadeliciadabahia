import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";

export const usePopState = (
  router: NextRouter,
  callback?: () => void | Promise<void>,
  deps = []
) => {
  useEffect(() => {
    const handlePopState = () => {
      callback?.();

      return false; // impede a navegação normal
    };

    router.beforePopState(handlePopState);

    return () => {
      // importante: volta o comportamento ao padrão quando desmontar
      router.beforePopState(() => true);
    };
  }, [router, ...deps]);
};
