import { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  BairroSelect,
  InformacoesAdicionaisStyle,
} from "@styles/pages/pedido/informacoes-adicionais/styles";
import { useMyOrder } from "@context/myOrderContext";
import { queryString } from "js-query-string-object";

import { useRouter } from "next/router";
import { ICliente } from "@models/order";
import { MyInput } from "@components/pedido/myInput";
import { IBairro } from "@models/endereco";
import { formatPhoneNumber, removeAccents } from "@util/format";
import { toast } from "react-toastify";
import Loading from "@components/loading";
import { env } from "@config/env";
import TextContainer from "@components/textContainer";
import BottomControls from "@components/pedido/bottomControls";
import Modal from "@components/modal";
import { usePromo } from "@context/promoContext";
import { Cards } from "@components/modalCards";
import { ButtonPrimary, ButtonSecondary } from "@styles/components/buttons";
import { taxaGratisAteTalHoras } from "@util/promo";
import Text from "@components/text";
import axios from "axios";
interface IData {
  cliente: ICliente;
  tipo: "retirada" | "entrega" | null;
}

const ENTREGANDO = false;
const InformacoesAdicionais: NextPage = () => {
  const { setInfo, myOrder } = useMyOrder();
  const { getTaxaGratis, getTaxaGratis36 } = usePromo();
  const [data, setData] = useState<IData | null>(null);
  const router = useRouter();
  const [nextInactive, setNextInactive] = useState<boolean>(false);
  const [neighbourhoods, setNeighbourhoods] = useState<IBairro[]>([]);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isFormUnlocked, setIsFormUnlocked] = useState<boolean>(false);

  const [showModalCEP, setShowModalCEP] = useState<boolean>(false);

  const getCustomerFromLocalStorage = () => {
    // const customer =
    //   (JSON.parse(localStorage.getItem("customer")) as ICliente) ?? null;

    /**
     * EXCLUSÕES
     * new Date("2024-03-02 00:00:00")
     * new Date("2024-05-14 00:00:00")
     */

    let customer = null;
    const isDev = localStorage.getItem("dev");
    if (!isDev) {
      const _ltex = localStorage.getItem("lastExclusion");
      const lastExclusion = _ltex ? new Date(_ltex) : null;
      customer =
        !lastExclusion || lastExclusion < new Date("2024-05-14 00:00:00")
          ? null
          : (JSON.parse(localStorage.getItem("customer")) as ICliente) ?? null;
    }
    setData({
      cliente: {
        nome: customer?.nome ?? "",
        whatsapp: customer?.whatsapp ?? "",
        endereco: customer?.endereco ?? {
          rua: "",
          numero: "",
          localDeEntrega: "",
          pontoDeReferencia: "",
          bairroId: "",
          cep: "",
        },
      },
      tipo: null,
    });

    setIsDataLoaded(true);
  };

  useEffect(() => {
    if (isDataLoaded && !showModal) {
      if (data?.tipo === "entrega" && !data?.cliente?.endereco?.cep) {
        setShowModalCEP(true);
      } else {
        setIsFormUnlocked(true);
      }
    }
  }, [showModal]);

  const getNeighbourhoods = async () => {
    const response = await (
      await fetch(`${env.apiURL}/bairros`, {
        headers: { "Content-Type": "application/json" },
      })
    ).json();

    setNeighbourhoods(response);
  };

  useEffect(() => {
    getNeighbourhoods();

    getCustomerFromLocalStorage();
  }, []);

  const next = async () => {
    try {
      setNextInactive(true);
      let endereco;
      if (data.tipo === "entrega") {
        const query = queryString({
          rua: removeAccents(data.cliente.endereco?.rua) ?? null,
          cep: data.cliente.endereco?.cep ?? null,
          bairroId: data.cliente.endereco?.bairroId ?? null,
          // number: data.cliente.endereco?.numero ?? null,
          // place: data.cliente.endereco?.localDeEntrega ?? null,
          // reference: data.cliente.endereco?.pontoDeReferencia ?? null,
        });

        endereco = (await (
          await fetch(`${env.apiURL}/taxa${query}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json()) as { cep: string; rua: string; bairroId: string } | null;
      }

      const customer = {
        ...data.cliente,
        endereco: { ...data.cliente.endereco, ...(endereco ?? {}) },
      };
      customer.endereco.taxa = getTaxaGratis(myOrder.itens)
        ? 3
        : customer.endereco.taxa;

      setInfo(
        customer,
        data.tipo,
        getTaxaGratis(myOrder.itens)
          ? 0
          : getTaxaGratis36(myOrder.itens)
          ? 0
          : taxaGratisAteTalHoras(myOrder)
          ? 0
          : Number(endereco?.taxa ?? 0)
      );

      if (data.tipo === "retirada" || endereco?.cep) {
        router.push(`/pedido/pagamento`);
      } else {
        router.push(`/pedido/confirmacao/${data.cliente.endereco.bairroId}`);
      }
    } catch (err) {
      console.error(err, err.stack);
      setNextInactive(false);
    }
  };

  const searchCEP = async (_cep?: string) => {
    try {
      const enderecos = (await (
        await fetch(
          `${env.apiURL}/enderecos?cep=${_cep ?? data.cliente.endereco.cep}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
      ).json()) as Array<{
        bairroId: string;
        cep: string;
        id: number;
        rua: string;
        taxa: number;
      }>;

      if (!enderecos?.length) throw new Error();

      const e = enderecos[0];

      setData((prev) => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          endereco: {
            ...prev.cliente.endereco,
            bairroId: e.bairroId,
            rua: e.rua,
          },
        },
      }));
    } catch (err) {
      toast("Endereço não encontrado", { type: "error" });
      console.error((err as Error).message, (err as Error).stack);
    }
  };

  useEffect(() => {
    if (isFormUnlocked) {
      (document.querySelector("#NOME") as HTMLElement)?.focus();
    }
  }, [showModal, showModalCEP, isDataLoaded]);

  const [loc, setLoc] = useState<
    { latitude: number; longitude: number } | undefined
  >();
  const [locErr, setLocErr] = useState("");
  const [locLoad, setLocLoad] = useState(false);

  useEffect(() => {
    if (loc?.latitude) {
      (async () => {
        setLocLoad(true);
        const r = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${loc.latitude}&lon=${loc.longitude}&format=json`
        );
        const _cep = r?.data?.address?.postcode;
        if (_cep) {
          setData((prev) => ({
            ...prev,
            cliente: {
              ...prev.cliente,
              endereco: {
                ...prev.cliente.endereco,
                cep: _cep as string,
              },
            },
          }));
          await searchCEP(_cep);

          setLocLoad(false);
        }
      })();
    }
  }, [loc]);

  return (
    <>
      {isDataLoaded && isFormUnlocked && (
        <InformacoesAdicionaisStyle>
          {!neighbourhoods.length || locLoad ? (
            <Loading />
          ) : (
            <>
              <TextContainer
                title="INFORMAÇÕES ADICIONAIS"
                description="OS CAMPOS COM * (ASTERISCO) SÃO OBRIGATÓRIOS"
              />
              <form className="menu">
                <section
                  className={`ordertype${
                    !data || !data.tipo ? " no-type" : ""
                  }`}
                >
                  <span>
                    <input
                      name="ordertype"
                      id="delivery"
                      disabled={!ENTREGANDO}
                      type={"radio"}
                      checked={(data && data.tipo === "entrega") ?? false}
                      onChange={(e) =>
                        e.target.checked &&
                        setData((prev) => ({ ...prev, tipo: "entrega" }))
                      }
                    />
                    <label htmlFor="delivery">QUERO DELIVERY</label>
                  </span>
                  <span>
                    <input
                      name="ordertype"
                      id="withdraw"
                      type={"radio"}
                      checked={(data && data.tipo === "retirada") ?? false}
                      onChange={(e) =>
                        e.target.checked &&
                        setData((prev) => ({ ...prev, tipo: "retirada" }))
                      }
                    />
                    <label htmlFor="withdraw">VOU BUSCAR</label>
                  </span>
                </section>
                <section
                  className={`customer-info${
                    !data || !data.tipo ? " disabled" : ""
                  }`}
                >
                  <MyInput
                    name="NOME *"
                    type="name"
                    value={(data && data.cliente.nome) ?? ""}
                    setValue={(value) =>
                      setData((prev) => ({
                        ...prev,
                        cliente: { ...prev.cliente, nome: value as string },
                      }))
                    }
                  />
                  <MyInput
                    name="WHATSAPP *"
                    type="phoneNumber"
                    value={(data && data.cliente.whatsapp) ?? ""}
                    minLength={8}
                    setValue={(value) =>
                      setData((prev) => ({
                        ...prev,
                        cliente: { ...prev.cliente, whatsapp: value as string },
                      }))
                    }
                  />

                  <section
                    className={`address-info${
                      !data || data.tipo !== "entrega" ? " disabled" : ""
                    }`}
                  >
                    <div className={`input-group cep-endereco-n`}>
                      <div className="cep">
                        <MyInput
                          tabIndex={
                            !data || data.tipo != "entrega" ? -1 : undefined
                          }
                          name="CEP"
                          type="zipCode"
                          placeholder="EX: 40000-000"
                          value={
                            data?.tipo === "entrega"
                              ? data?.cliente?.endereco?.cep ?? ""
                              : ""
                          }
                          setValue={(value) =>
                            setData((prev) => ({
                              ...prev,
                              cliente: {
                                ...prev.cliente,
                                endereco: {
                                  ...prev.cliente.endereco,
                                  cep: value as string,
                                },
                              },
                            }))
                          }
                        />
                        <button
                          type="button"
                          disabled={
                            String(data?.cliente?.endereco?.cep).replace(
                              /[^0-9]/g,
                              ""
                            ).length !== 8
                          }
                          onClick={async () => await searchCEP()}
                        >
                          🔎
                        </button>
                      </div>
                      <MyInput
                        tabIndex={
                          !data || data.tipo != "entrega" ? -1 : undefined
                        }
                        name="ENDEREÇO (RUA/AVENIDA) *"
                        placeholder="EX: AVENIDA ANITA GARIBALDI"
                        type="address"
                        value={
                          data?.tipo === "entrega"
                            ? data?.cliente?.endereco?.rua ?? ""
                            : ""
                        }
                        setValue={(value) =>
                          setData((prev) => ({
                            ...prev,
                            cliente: {
                              ...prev.cliente,
                              endereco: {
                                ...prev.cliente.endereco,
                                rua: value as string,
                              },
                            },
                          }))
                        }
                      />
                      <MyInput
                        tabIndex={
                          !data || data.tipo != "entrega" ? -1 : undefined
                        }
                        name="Nº"
                        placeholder="EX: 427-B"
                        type="text"
                        maxLength={7}
                        value={
                          data?.tipo === "entrega"
                            ? data?.cliente?.endereco?.numero ?? ""
                            : ""
                        }
                        setValue={(value) =>
                          setData((prev) => ({
                            ...prev,
                            cliente: {
                              ...prev.cliente,
                              endereco: {
                                ...prev.cliente.endereco,
                                numero: value as string,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className={`input-group bairro-local-referencia`}>
                      <BairroSelect>
                        <label htmlFor="bairro-select">BAIRRO *</label>
                        <select
                          name="bairro-select"
                          value={
                            data?.tipo === "entrega"
                              ? data?.cliente?.endereco?.bairroId ?? ""
                              : ""
                          }
                          onChange={(e) =>
                            setData((prev) => ({
                              ...prev,
                              cliente: {
                                ...prev.cliente,
                                endereco: {
                                  ...prev.cliente.endereco,
                                  bairroId: e.target.value,
                                },
                              },
                            }))
                          }
                        >
                          <option value={""}>--Selecione--</option>
                          {neighbourhoods.map((n) => (
                            <option value={n.id} key={n.id}>
                              {n.nome}
                            </option>
                          ))}
                        </select>
                      </BairroSelect>

                      <MyInput
                        tabIndex={
                          !data || data.tipo != "entrega" ? -1 : undefined
                        }
                        name="LOCAL DE ENTREGA"
                        tag="local"
                        placeholder="EX: COND. ONDINA TOP, EDF. FLORES, AP. 101"
                        type="text"
                        value={
                          data?.tipo === "entrega"
                            ? data?.cliente?.endereco?.localDeEntrega ?? ""
                            : ""
                        }
                        setValue={(value) =>
                          setData((prev) => ({
                            ...prev,
                            cliente: {
                              ...prev.cliente,
                              endereco: {
                                ...prev.cliente.endereco,
                                localDeEntrega: value as string,
                              },
                            },
                          }))
                        }
                      />
                      <MyInput
                        tabIndex={
                          !data || data.tipo != "entrega" ? -1 : undefined
                        }
                        name="PONTO DE REFERÊNCIA"
                        placeholder="EX: EM FRENTE AO MERCADO NOVA ESPERANÇA"
                        type="text"
                        value={
                          (data?.tipo === "entrega" &&
                            data?.cliente?.endereco?.pontoDeReferencia) ??
                          ""
                        }
                        setValue={(value) =>
                          setData((prev) => ({
                            ...prev,
                            cliente: {
                              ...prev.cliente,
                              endereco: {
                                ...prev.cliente.endereco,
                                pontoDeReferencia: value as string,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </section>
                </section>
              </form>

              <BottomControls
                backButton
                primaryButton={{
                  click: next,
                  disabled:
                    nextInactive ||
                    !data ||
                    data.tipo === null ||
                    data.cliente.nome === "" ||
                    data.cliente.whatsapp === "" ||
                    (data.tipo === "entrega" &&
                      data.cliente.endereco.rua === "") ||
                    data.cliente.nome.length < 2 ||
                    (data.cliente.whatsapp ?? "").length < 8 ||
                    (data.tipo === "entrega" &&
                      (data.cliente.endereco?.rua?.length ?? 0) < 5) ||
                    (data.tipo === "entrega" &&
                      !data.cliente.endereco?.bairroId),
                }}
              />
            </>
          )}
        </InformacoesAdicionaisStyle>
      )}
      {showModal && (
        <Modal
          className="withdraw-delivery-modal"
          label="Qual o tipo do seu pedido?"
          description="Você vem buscar ou é pra entrega?"
          type={"custom"}
        >
          <Cards
            items={[
              {
                id: "r",
                label: "Retirada",
                image: "/images/card-retirada.png",
                click: () => {
                  setData((prev) => ({ ...prev, tipo: "retirada" }));
                  setShowModal(false);
                },
              },
              {
                id: "e",
                label: "Entrega",
                image: "/images/card-entrega.png",
                disabled: !ENTREGANDO,
                click: () => {
                  setData((prev) => ({ ...prev, tipo: "entrega" }));
                  setShowModal(false);
                },
              },
            ]}
          />
        </Modal>
      )}
      {showModalCEP && (
        <Modal
          className="cep-modal"
          label="Qual seu CEP?"
          description="Se não souber, não tem problema!"
          type={"custom"}
          buttons={
            <>
              <ButtonSecondary
                onClick={() => {
                  if (navigator.geolocation) {
                    setLocLoad(true);
                    navigator.geolocation.getCurrentPosition(
                      (x) => {
                        setLoc({
                          latitude: x.coords.latitude,
                          longitude: x.coords.longitude,
                        });
                      },
                      (error) => {
                        switch (error.code) {
                          case error.PERMISSION_DENIED:
                            setLocErr("Permissão negada pelo usuário");
                            break;
                          case error.POSITION_UNAVAILABLE:
                            setLocErr("Localização indisponível");
                            break;
                          case error.TIMEOUT:
                            setLocErr("Tempo para obter localização esgotado!");
                            break;
                          default:
                            setLocErr("Erro desconhecido!");
                        }
                      }
                    );
                    setLocLoad(false);
                  } else {
                    setLocErr("Geolocalização não é suportada pelo navegador!");
                  }
                  setShowModalCEP(false);
                  setIsFormUnlocked(true);
                }}
              >
                Não sei meu CEP
              </ButtonSecondary>

              <ButtonPrimary
                id={"CEP-OK"}
                disabled={
                  (data?.cliente?.endereco?.cep ?? "").replace(/[^0-9]/g, "")
                    .length !== 8
                }
                onClick={async () => {
                  await searchCEP();
                  setShowModalCEP(false);
                  setIsFormUnlocked(true);
                }}
              >
                Pronto!
              </ButtonPrimary>
            </>
          }
        >
          <MyInput
            tabIndex={!data || data.tipo != "entrega" ? -1 : undefined}
            name=""
            id="cepmodal"
            type="zipCode"
            placeholder="EX: 40000-000"
            value={
              data?.tipo === "entrega" ? data?.cliente?.endereco?.cep ?? "" : ""
            }
            setValue={(value) => {
              setData((prev) => ({
                ...prev,
                cliente: {
                  ...prev.cliente,
                  endereco: {
                    ...prev.cliente.endereco,
                    cep: value as string,
                  },
                },
              }));

              if ((value as string).replace(/[^0-9]/g, "").length === 8) {
                (document.querySelector("#cepmodal") as HTMLElement)?.blur();
              }
            }}
          />
          {!!locErr && (
            <Text type={"description"} color="red">
              {locErr}
            </Text>
          )}
          {/* {!!loc?.latitude && (
            <MyInput
              name="sdasad"
              type="text"
              value={`lat: ${loc.latitude}, long: ${loc.longitude}`}
              setValue={() => {}}
            />
          )} */}
        </Modal>
      )}

      {/* {showModalWhatsapp && (
        <Modal
          className="whatsapp-modal"
          label={formatPhoneNumber(data?.cliente?.whatsapp)}
          description="Está correto esse número?"
          type={"custom"}
          buttons={
            <>
              <ButtonSecondary
                onClick={() => {
                  setShowModalCEP(false);
                  setIsFormUnlocked(true);
                }}
              >
                Está errado
              </ButtonSecondary>

              <ButtonPrimary
                disabled={
                  (data?.cliente?.endereco?.cep ?? "").replace(/[^0-9]/g, "")
                    .length !== 8
                }
                onClick={() => {
                  searchCEP();
                  setShowModalCEP(false);
                  setIsFormUnlocked(true);
                }}
              >
                Está correto!
              </ButtonPrimary>
            </>
          }
        >
          
          

        </Modal>
      )} */}
    </>
  );
};

export default InformacoesAdicionais;
