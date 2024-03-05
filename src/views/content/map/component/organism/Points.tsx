import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { getSchools } from "../../../../../_stores/school.store";
import { getStops } from "../../../../../_stores/stop.store";
import { SchoolPoints } from "./SchoolPoints";
import { StopPoints } from "./StopPoints";

export const linkMap = new Map<number, L.CircleMarker>();

export const [blinkingStops, setBlinkingStops] = createSignal<number[]>([]);

export const [blinkingSchools, setBlinkingSchools] = createSignal<number[]>([]);

export const [cursorIsOverPoint, setCursorIsOverPoint] =
  createSignal<boolean>(false);

export function deselectAllPoints() {
  getSchools().map((point) => point.setSelected(false));
  getStops().map((point) => point.setSelected(false));
}
export const [pointsReady, setPointsReady] = createSignal(false);

interface PointsProps {
  leafletMap: L.Map;
  stops: StopType[];
  schools: SchoolType[];
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
      <StopPoints leafletMap={props.leafletMap} stops={props.stops} />
      <SchoolPoints leafletMap={props.leafletMap} schools={props.schools} />
    </div>
  );
}
