import L from "leaflet";
import "leaflet/dist/leaflet.css";

// let map: L.Map;
let mapTabs: {
  idDiv: string;
  map: L.Map;
}[] = [];

const initMap = (idDiv: string) => {
  const newMap = L.map(idDiv).setView(
    [-20.9466588303741, 55.5343806753509],
    15
  );

  // Cannot use the same instance of L.tileLayer for multiple maps
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(newMap);

  return newMap;
};

export const initialiseMap = (idDiv: string) => {
  let map = mapTabs.filter((m) => m.idDiv === idDiv)[0];
  const newMap = initMap(idDiv);

  if (map == undefined) {
    mapTabs.push({ idDiv, map: newMap });
    return newMap;
  }

  map.map.off();
  map.map.remove();
  map.map = newMap;

  return map.map;
};
