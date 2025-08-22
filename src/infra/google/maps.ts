import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const ORIGIN_COORDS = { lat: -12.9714, lng: -38.5014 }; // Salvador exemplo

export async function googleAutocomplete(query: string) {
  const res = await axios.get(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    {
      params: {
        input: query,
        key: GOOGLE_API_KEY,
        language: "pt-BR",
        components: "country:br",
      },
    }
  );
  return res.data.predictions;
}

export async function googlePlaceDetails(placeId: string) {
  const res = await axios.get(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        place_id: placeId,
        key: GOOGLE_API_KEY,
        language: "pt-BR",
      },
    }
  );
  return res.data.result;
}

export async function googleDistanceMatrix(destLat: number, destLng: number) {
  const res = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        origins: `${ORIGIN_COORDS.lat},${ORIGIN_COORDS.lng}`,
        destinations: `${destLat},${destLng}`,
        mode: "bicycling",
        key: GOOGLE_API_KEY,
        language: "pt-BR",
      },
    }
  );
  return res.data.rows[0].elements[0]; // distance + duration
}
