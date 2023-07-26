import L from "leaflet";
import "leaflet/dist/leaflet.css";

const mapTabs: {
  idDiv: string;
  map: L.Map;
}[] = [];

const initMap = (idDiv: string, withTiles: boolean) => {
  const newMap = L.map(idDiv).setView(
    [-20.9466588303741, 55.5343806753509],
    15
  );

  if (withTiles) {
    // Cannot use the same instance of L.tileLayer for multiple maps
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        // eslint-disable-next-line quotes
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);
  }

  return newMap;
};

export const initialiseMap = (idDiv: string, withTiles = true) => {
  const map = mapTabs.filter((m) => m.idDiv === idDiv)[0];

  if (map == undefined) {
    //If the map is not already initialised create a new one
    const newMap = initMap(idDiv, withTiles);
    mapTabs.push({ idDiv, map: newMap });
    return newMap;
  }

  const div = document.getElementById(idDiv);
  const container = map.map.getContainer();

  //If the map is already initialised and we are in the same page return it
  if (container === div) {
    return map.map;
  }

  //If the map is already initialised but we are in another page we need to move the map to the new div
  const parent = div?.parentElement;
  div?.remove();
  parent?.appendChild(container);

  return map.map;
};
