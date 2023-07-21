import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMount } from "solid-js";
import { layerTilesList } from "../../constant";

let map: L.Map;
export default function (props: { lon: number; lat: number; zoom: number }) {
  onMount(() => {
    const lon = props.lon;
    const lat = props.lat;
    const zoom = props.zoom;
    console.log("map", map);
    if (map != undefined) {
      map.off();
      map.remove();
      console.log("je remove");
    }

    map = L.map("map-container").setView([lat, lon], zoom);
    console.log("map", map);
    layerTilesList[0].tileContent.addTo(map);
  });

  return <div id="map-container" style={{ width: "100%", height: "500px" }} />;
}
