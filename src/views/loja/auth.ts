import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const pages = {
  home: "/loja/home",
  login: "/loja/login",
};

export const useAuth = () => {
  const router = useRouter();

  const [authCarregado, setAuthCarregado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("loja-token");

    if (!token && router.pathname !== pages.login) router.replace(pages.login);
    if (token && router.pathname === pages.login) router.replace(pages.home);
  }, []);

  return {
    authCarregado,
  };
};
