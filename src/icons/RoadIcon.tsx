import { FaSolidRoad } from "solid-icons/fa";
import "./RoadIcon.css";

export function RoadIcon(props: { color: string }) {
  return (
    <FaSolidRoad
      class="road"
      classList={{
        green: props.color == "green",
        yellow: props.color == "yellow",
      }}
    />
  );
}
