import { FaSolidLocationDot } from "solid-icons/fa";
import "./LocationDotIcon.css";

export function LocationDotIcon(props: { color: string }) {
  return (
    <FaSolidLocationDot
      class="location-dot"
      classList={{
        green: props.color == "green",
        yellow: props.color == "yellow",
      }}
    />
  );
}
