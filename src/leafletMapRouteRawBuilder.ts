import L from "leaflet";
import { Road, Troncon, toLatLng } from "./utils";

function drawRoad(road: Road, map: L.Map) {
  const tronconsLatLng = road.troncons.map((troncon: Troncon) => {
    const geoJson = JSON.parse(troncon.the_geom);
    return geoJson.coordinates.map(toLatLng);
  });

  const polyline = L.polyline(tronconsLatLng, {
    color: "#5AF8",
    weight: 4,
  }).addTo(map);

  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());
}

export function buildMapLeafletRouteRaw(div: HTMLDivElement) {
  const map = L.map(div).setView([-20.90367, 55.47519], 14);

  fetch(
    import.meta.env.VITE_BACK_URL + "/get_route_by_name_raw?name=bd%20lancastel"
  )
    .then((response) => response.json())
    .then((data) => drawRoad({ troncons: data }, map));
}
