import L from "leaflet";
import { layerTilesList } from "../../src/views/content/graphicage/constant";

let map: L.Map;

export const initialiseMap = (idDiv: string) => {
  if (map != undefined) {
    map.off();
    map.remove();
  }

  map = L.map(idDiv).setView([-20.9466588303741, 55.5343806753509], 15);
  layerTilesList[0].tileContent.addTo(map);
  return map;
};
