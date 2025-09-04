import { MyInput } from "@components/pedido/myInput";
import { LoginViewStyle } from "./styles";
import { useState } from "react";
import { ButtonSecondary } from "@styles/components/buttons";
import { api, axiosOk } from "@util/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import TextContainer from "@components/textContainer";
import { AxiosError } from "axios";

export const LoginView = () => {
  const [login, setLogin] = useState<{ email: string; senha: string }>({
    email: "",
    senha: "",
  });
  const router = useRouter();
  const logar = async () => {
    try {
      const res = await api.post("/loja/login", {
        ...login,
      });

      if (!axiosOk(res.status)) throw new Error();

      localStorage.setItem("loja-token", res.data);

      router.push("/loja/app/home");
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError) {
        if (err.status === 404) toast.error("Email/senha incorretos!");
      } else {
        toast.error("Erro interno no servidor!");
      }
    }
  };
  return (
    <LoginViewStyle>
      <TextContainer title="Site-PDB" subtitle="Sistema de gestão" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <MyInput
          name="Email"
          type="email"
          value={login.email}
          setValue={(v) =>
            setLogin((prev) => ({ ...prev, email: v as string }))
          }
        />
        <MyInput
          name="Senha"
          type="password"
          value={login.senha}
          setValue={(v) =>
            setLogin((prev) => ({ ...prev, senha: v as string }))
          }
        />
        <ButtonSecondary onClick={() => logar()}>Entrar</ButtonSecondary>
      </form>
    </LoginViewStyle>
  );
};
