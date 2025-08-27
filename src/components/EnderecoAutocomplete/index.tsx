import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { EnderecoAutocompleteStyle, InputAndList, MapaStyle } from "./styles";
import { IBairro } from "tpdb-lib";
import { MyInput } from "@components/pedido/myInput";
import { useRouter } from "next/router";
import { useEnderecoAutocomplete } from "@util/hooks/debouncedFunction";
import axios from "axios";
import { env } from "@config/env";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({
  setPosition,
}: {
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    dragend(e) {
      const map = e.target;
      const center = map.getCenter();
      setPosition([center.lat, center.lng]);
    },
  });
  return null;
}

export default function LocalizacaoCliente({
  bairro,
  posicaoLoja,
  posicaoCliente,
}: {
  bairro: IBairro;
  posicaoCliente: [number, number];
  posicaoLoja: [number, number];
}) {
  const [input, setInput] = useState("");
  // const [hiddenInput, setHiddenInput] = useState("");
  const {
    setInputValue: setHiddenInput,
    suggestions,
    loading,
  } = useEnderecoAutocomplete({
    bairro: bairro.nome,
    defaultPosition: posicaoCliente,
  });

  const [position, setPosition] = useState<[number, number] | null>(
    posicaoCliente ?? posicaoLoja
  );

  useEffect(() => {
    if (!position) return;
    const [lat, lon] = position;

    axios
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      )
      .then((res) => {
        if (res?.data?.address?.postcode) {
          const rua = res?.data?.address?.road;
          if (rua) setHiddenInput({ value: rua, showSuggestions: true });
        }
      });
  }, [position]);

  useEffect(() => {
    setHiddenInput({ value: input, showSuggestions: true });
  }, [input]);

  const router = useRouter();

  const [itemClicked, setItemClicked] = useState("");

  const sugestoesUnicas = suggestions.filter(
    (item, index, self) => index === self.findIndex((e) => e.rua === item.rua)
  );

  return (
    <EnderecoAutocompleteStyle>
      <MapaStyle>
        {position && (
          <>
            <>
              <MapContainer
                center={position}
                zoom={16}
                style={{ flex: 1, borderRadius: "10px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapClickHandler setPosition={setPosition} />
                <Marker
                  position={position}
                  icon={markerIcon}
                  draggable
                  eventHandlers={{
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      console.log("mudou position manualmente");
                      setPosition([lat, lng]);
                    },
                  }}
                />
              </MapContainer>
            </>
          </>
        )}
      </MapaStyle>

      <InputAndList>
        <MyInput
          type="address"
          name=""
          placeholder="Digite seu endereço ou cep..."
          value={input}
          setValue={(value) => setInput(value as string)}
        />
        {loading ? (
          <h3>Carregando...</h3>
        ) : (
          <ul>
            {sugestoesUnicas.map((sug, idx) => {
              const bairro = sug.bairro;

              return (
                <li
                  className={`sugestao ${
                    itemClicked === sug.id ? "clicked" : ""
                  }`}
                  key={idx}
                  onClick={() => {
                    if (itemClicked !== sug.id) {
                      setItemClicked(sug.id);
                      setPosition([sug.lat, sug.lon]);
                      setHiddenInput({ value: sug.rua, showSuggestions: true });

                      sessionStorage.setItem("endereco", JSON.stringify(sug));
                      router.push("/cliente/novo-endereco/complemento");
                    }
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
                </li>
              );
            })}
          </ul>
        )}
      </InputAndList>
    </EnderecoAutocompleteStyle>
  );
}
