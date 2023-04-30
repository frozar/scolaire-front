let leafletMap: L.Map;

export function setLeafletMap(leafletMapArg: L.Map) {
  leafletMap = leafletMapArg;
}

export function getLeafletMap(): L.Map {
  return leafletMap;
}
