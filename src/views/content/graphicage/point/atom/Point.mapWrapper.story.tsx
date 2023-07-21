import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMount } from "solid-js";

import { initialiseMap } from "../../../../../../.storybook/utils/mapWrapper";
import Point from "./Point";

interface PointStoryProps {
  radius: number;
  weight: number;
  borderColor: string;
  fillColor: string;
  isBlinking: boolean;
}

export default function (props: PointStoryProps) {
  let map: L.Map;

  onMount(() => {
    map = initialiseMap("map-container");
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

  return (
    <div id="map-container" style={{ width: "100%", height: "500px" }}>
      <Point
        idPoint={1}
        onIsLast={() => console.log("ok")}
        lat={-20.9466588303741}
        lon={55.5343806753509}
        map={getMap()}
        onClick={onClick}
        borderColor={props.borderColor}
        fillColor={props.fillColor}
        isLast={false}
        onDBLClick={onDBLClick}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        radius={props.radius}
        weight={props.weight}
        isBlinking={props.isBlinking}
      />
    </div>
  );
}
