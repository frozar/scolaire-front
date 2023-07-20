import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createSignal, onMount } from "solid-js";
import {
  NatureEnum,
  PointIdentityType,
  PointRamassageType,
} from "../../../type";
import Point from "./Point";
import { layerTilesList } from "./constant";

interface PointStoryProps {
  radius: number;
  weight: number;
  borderColor: string;
  fillColor: string;
}

export default function (props: PointStoryProps) {
  let map: L.Map;

  onMount(() => {
    map = L.map("map-container").setView(
      [-20.9466588303741, 55.5343806753509],
      15
    );
    layerTilesList[0].tileContent.addTo(map);
  });

  const getMap = () => map;

  const onClick = () => {
    return;
  };
  const onDBLClick = () => {
    return;
  };
  const onMouseOut = () => {
    return;
  };
  const onMouseOver = () => {
    return;
  };

  const [selected, setSelected] = createSignal<boolean>(false);
  const [associatedPoints, setAssociatedPoints] = createSignal<
    PointIdentityType[]
  >([]);

  const point: PointRamassageType = {
    id: 16,
    idPoint: 48,
    lat: -20.9466588303741,
    lon: 55.5343806753509,
    name: "test",
    nature: NatureEnum.ramassage,
    quantity: 0,
    selected,
    setSelected,
    associatedPoints,
    setAssociatedPoints,
  };

  return (
    <div id="map-container" style={{ width: "100%", height: "500px" }}>
      <Point
        map={getMap()}
        onClick={onClick}
        borderColor={props.borderColor}
        fillColor={props.fillColor}
        isLast={false}
        onDBLClick={onDBLClick}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        point={point}
        radius={props.radius}
        weight={props.weight}
        isBlinking={false}
      />
    </div>
  );
}
