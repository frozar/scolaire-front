import L from "leaflet";
import { LatLng } from "leaflet";
import { geomToLatLng, Troncon, Road } from "./utils";
import { colorInterpolation, MinMax } from "./color";

function minOrMaxAltitude(
  troncons: Troncon[],
  minOrMaxFunction: { (...values: number[]): number }
): number {
  const tronconsMinOrMax = troncons.map((troncon: Troncon) => {
    const altitudes = geomToLatLng(troncon.the_geom).map((latLng: LatLng) => {
      return latLng.alt as number;
    });
    return minOrMaxFunction(...altitudes);
  });
  return minOrMaxFunction(...tronconsMinOrMax);
}

function drawTroncon(troncon: Troncon, minMax: MinMax, map: L.Map) {
  const tronconsLatLng = geomToLatLng(troncon.the_geom);

  colorInterpolation(minMax, minMax.min.value + 7);

  for (let i: number = 0; i < tronconsLatLng.length - 1; ++i) {
    const altitudeAvg =
      ((tronconsLatLng[i].alt as number) +
        (tronconsLatLng[i + 1].alt as number)) /
      2;
    L.polyline([tronconsLatLng[i], tronconsLatLng[i + 1]], {
      color:
        altitudeAvg == -1000 ? "#F00" : colorInterpolation(minMax, altitudeAvg),
      weight: 5,
    }).addTo(map);
  }
}

function drawTroncons(road: Road, map: L.Map) {
  const minAltitude = minOrMaxAltitude(road.troncons, Math.min);
  const maxAltitude = minOrMaxAltitude(road.troncons, Math.max);
  console.log("minAltitude", minAltitude);
  console.log("maxAltitude", maxAltitude);

  const minMax = {
    min: { value: minAltitude, color: "#55AAFFF0" },
    max: { value: maxAltitude, color: "#000000FF" },
  };

  for (let i: number = 0; i < road.troncons.length / 1000; ++i) {
    drawTroncon(road.troncons[i], minMax, map);
  }
}

export function buildMapLeafletPostCode(div: HTMLDivElement) {
  const map = L.map(div).setView([-20.90367, 55.47519], 14);

  fetch(
    import.meta.env.VITE_BACK_URL + "/get_routes_by_postcode_raw?postCode=97411"
  )
    .then((response) => response.json())
    .then((data) => drawTroncons({ troncons: data }, map));
}
