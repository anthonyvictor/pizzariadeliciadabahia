import { InputAndListStyle } from "./styles";
import { MyInput } from "@components/pedido/myInput";
import { useRuaPage } from "../../context";
import { useRouter } from "next/router";
import { env } from "@config/env";
import { createRef } from "react";
import { IEnderecoCliente } from "tpdb-lib";

export const InputAndList = () => {
  const {
    pesqEnderecos,
    carregEnderecos,
    enderecos,
    expandirLista,
    eventoPesq,
  } = useRuaPage();
  const router = useRouter();
  const inputRef = createRef<HTMLDivElement>();
  return (
    <InputAndListStyle expand={expandirLista}>
      <MyInput
        ref={inputRef}
        type="address"
        name=""
        placeholder="Digite seu endereço ou cep..."
        value={pesqEnderecos}
        setValue={(value) => eventoPesq(value as string)}
        onFocus={() =>
          setTimeout(() => {
            inputRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 300)
        }
      />
      <ul>
        {carregEnderecos ? (
          <div className="carregando">
            <h2>Carregando...</h2>
          </div>
        ) : (
          <>
            {enderecos.map((sug, idx) => {
              const bairro = sug.bairro;

              return (
                <li
                  // onMouseEnter={(ev) => {
                  //   ev.preventDefault();
                  //   if (env.environment === "development") {
                  //     navigator?.clipboard?.writeText?.(
                  //       JSON.stringify(sug, null, 2)
                  //     );
                  //   }
                  // }}
                  className={`sugestao`}
                  key={idx}
                  onClick={() => {
                    const endereco: IEnderecoCliente = {
                      visivel: true,
                      enderecoOriginal: sug,
                    } as IEnderecoCliente;

                    console.log("⚠️⚠️⚠️ vai salvar no session", endereco);
                    sessionStorage.setItem(
                      "endereco",
                      JSON.stringify(endereco)
                    );
                    router.push("/cliente/novo-endereco/regras");
                  }}
                >
                  <h4>{sug.rua}</h4>
                  <small>
                    {[
                      bairro,
                      ...(env.environment === "production"
                        ? []
                        : [sug.cidade, sug.cep]),
                    ]
                      .filter(Boolean)
                      .join(" - ")}
                  </small>
                  {env.environment === "development" && (
                    <p style={{ fontSize: "0.7rem" }}>
                      <span>
                        lat: {sug.lat}, lon: {sug.lon}
                      </span>
                    </p>
                  )}
                </li>
              );
            })}
          </>
        )}
      </ul>
    </InputAndListStyle>
  );
};
