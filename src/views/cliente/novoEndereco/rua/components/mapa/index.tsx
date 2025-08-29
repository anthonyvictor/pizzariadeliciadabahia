import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Popup,
  Circle,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { MapaStyle } from "./styles";
import { useRuaPage } from "../../context";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import React from "react";
import { enderecoPizzaria } from "@util/dados";

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

// 🔹 Componente auxiliar para habilitar zoom só com Ctrl
function CtrlZoomHandler() {
  const map = useMap();

  React.useEffect(() => {
    map.scrollWheelZoom.disable();

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
      }
    };

    map.getContainer().addEventListener("wheel", handleWheel);

    return () => {
      map.getContainer().removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
}

function TwoFingerDragHandler() {
  const map = useMap();

  React.useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (isCoarsePointer) {
      // 📱 Mobile/tablet → exige dois dedos
      map.dragging.disable();

      const container = map.getContainer();

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          map.dragging.enable();
        } else {
          map.dragging.disable();
        }
      };

      container.addEventListener("touchstart", handleTouchStart);

      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
      };
    } else {
      // 🖱️ Desktop normal → arrasto liberado
      map.dragging.enable();
    }
  }, [map]);

  return null;
}

export default function Mapa() {
  const { posMapa, eventoArrastar } = useRuaPage();

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const emptyIcon = L.divIcon({
    html: "", // nada dentro
    className: "empty-icon", // classe vazia para não ter estilos
    iconSize: [0, 0],
  });

  return (
    <MapaStyle>
      {posMapa && (
        <MapContainer
          center={posMapa}
          zoom={16}
          style={{ flex: 1, borderRadius: "10px" }}
          // 🔹 Aqui: ativa o "two-finger drag" só no mobile
          dragging={true}
          scrollWheelZoom={false} // começa desabilitado
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler
            setPosition={([lat, lon]) => {
              // setPosition
              eventoArrastar(lat, lon);
            }}
          />
          <Marker
            position={posMapa}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                eventoArrastar(lat, lng);
              },
            }}
          />
          {/* <Marker position={[-12.9777, -38.5016]}>
            <Popup>
              <div>
                <h3>Pizzaria Ondina</h3>
                <p>Aberto até 23h</p>
              </div>
            </Popup>
          </Marker> */}
          {/* <Marker
            position={[-12.9777, -38.5016]}
            icon={L.divIcon({
              className: "custom-pin",
              html: `<div style="background: red; border-radius: 50%; width: 20px; height: 20px">
                
              </div>`,
            })}
          /> */}
          <Marker
            position={[enderecoPizzaria.lat, enderecoPizzaria.lon]}
            icon={emptyIcon}
          >
            <Tooltip
              permanent
              direction="top"
              position={[enderecoPizzaria.lat, enderecoPizzaria.lon]}
            >
              <span>🍕 Pizzaria Delicia</span>
            </Tooltip>
          </Marker>
          <CtrlZoomHandler />
          <TwoFingerDragHandler /> {/* 🔹 adiciona aqui */}
        </MapContainer>
      )}
    </MapaStyle>
  );
}
