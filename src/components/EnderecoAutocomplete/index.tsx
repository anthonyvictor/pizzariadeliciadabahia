import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { EnderecoAutocompleteStyle, InputAndList, MapaStyle } from "./styles";
import { IBairro } from "tpdb-lib";
import { MyInput } from "@components/pedido/myInput";
import { useRouter } from "next/router";
import { useEnderecoAutocomplete } from "@util/hooks/debouncedFunction";
import { env } from "@config/env";
import { useState } from "react";

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
  const {
    inputValue,
    suggestions,
    loading,
    position,
    handleDragEnd,
    handleInputChange,
  } = useEnderecoAutocomplete({
    bairro: bairro.nome,
    defaultPosition: posicaoCliente ?? posicaoLoja,
  });

  const router = useRouter();

  const sugestoesUnicas = suggestions.filter(
    (item, index, self) => index === self.findIndex((e) => e.rua === item.rua)
  );

  const [expandSearch, setExpandSearch] = useState(false);

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
                <MapClickHandler
                  setPosition={([lat, lon]) => {
                    // setPosition
                    handleDragEnd(lat, lon);
                  }}
                />
                <Marker
                  position={position}
                  icon={markerIcon}
                  draggable
                  eventHandlers={{
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      handleDragEnd(lat, lng);
                    },
                  }}
                />
              </MapContainer>
            </>
          </>
        )}
      </MapaStyle>

      <InputAndList expand={expandSearch}>
        <MyInput
          type="address"
          name=""
          placeholder="Digite seu endereço ou cep..."
          value={inputValue}
          setValue={(value) => handleInputChange(value as string)}
        />
        {loading ? (
          <h3>Carregando...</h3>
        ) : (
          <ul>
            {sugestoesUnicas.map((sug, idx) => {
              const bairro = sug.bairro;

              return (
                <li
                  className={`sugestao`}
                  key={idx}
                  onClick={() => {
                    sessionStorage.setItem("endereco", JSON.stringify(sug));
                    router.push("/cliente/novo-endereco/complemento");
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
