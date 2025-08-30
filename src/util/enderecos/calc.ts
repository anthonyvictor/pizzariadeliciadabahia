export type Bbox = {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
};

export function expandBbox(
  { maxLat, maxLon, minLat, minLon }: Bbox,
  km: number
): Bbox {
  // usa latitude central da bbox para calcular a escala da longitude
  const latCenter = (minLat + maxLat) / 2;

  const deltaLat = km / 111; // graus de latitude
  const deltaLon = km / (111 * Math.cos((latCenter * Math.PI) / 180)); // graus de longitude

  return {
    minLon: minLon - deltaLon,
    minLat: minLat - deltaLat,
    maxLon: maxLon + deltaLon,
    maxLat: maxLat + deltaLat,
  };
}
