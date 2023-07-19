import L from "leaflet";
import { onMount } from "solid-js";
import { layerTilesList } from "./constant";

let ref: HTMLDivElement;
export default function () {
  onMount(() => {
    const map = L.map("map-container").setView([-20.930746, 55.527503], 13);
    layerTilesList[0].tileContent.addTo(map);
  });

  // const onClick = () => {
  //   return;
  // };
  // const onDBLClick = () => {
  //   return;
  // };
  // const onMouseOut = () => {
  //   return;
  // };
  // const onMouseOver = () => {
  //   return;
  // };

  // const point: PointRamassageType = {
  //   id: 16,
  //   idPoint: 48,
  //   lat: -20.9466588303741,
  //   lon: 55.5343806753509,
  //   name: "test",
  //   nature: NatureEnum.ramassage,
  //   quantity: 0,
  // };

  return (
    <div
      ref={ref}
      id="map-container"
      style={{ width: "100%", height: "500px" }}
    >
      {/* <Point
        onClick={onClick}
        borderColor="red"
        fillColor="white"
        isLast={false}
        onDBLClick={onDBLClick}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        point={point}
        radius={3}
        weight={4}
        isBlinking={false}
      /> */}
    </div>
  );
}
