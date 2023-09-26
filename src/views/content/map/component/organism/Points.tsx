import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { SchoolPoints, getSchools } from "./SchoolPoints";
import { StopPoints, getStops } from "./StopPoints";

export const linkMap = new Map<number, L.CircleMarker>();

export const [blinkingStops, setBlinkingStops] = createSignal<number[]>([]);

export const [blinkingSchools, setBlinkingSchools] = createSignal<number[]>([]);

export const [cursorIsOverPoint, setCursorIsOverPoint] =
  createSignal<boolean>(false);

export function deselectAllPoints() {
  getSchools().map((point) =>
    point.setSelected((prev) => {
      return prev == false ? prev : false;
    })
  );
  getStops().map((point) =>
    point.setSelected((prev) => {
      return prev == false ? prev : false;
    })
  );
}
export const [pointsReady, setPointsReady] = createSignal(false);

interface PointsProps {
  leafletMap: L.Map;
}

export function Points(props: PointsProps) {
  createEffect(() => {
    if (getSchools().length == 0 || getStops().length == 0) {
      return;
    }

    setPointsReady(true);
  });
  return (
    <div>
      <StopPoints leafletMap={props.leafletMap} />
      <SchoolPoints leafletMap={props.leafletMap} />
    </div>
  );
}
