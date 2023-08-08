import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { EleveVersEtablissementType } from "../../../../../type";
import { SchoolPoints, getLeafletSchools } from "./SchoolPoints";
import { StopPoints, getLeafletStops } from "./StopPoints";

export const linkMap = new Map<number, L.CircleMarker>();

export const [blinkingStops, setBlinkingStops] = createSignal<number[]>([]);

export const [blinkingSchools, setBlinkingSchools] = createSignal<number[]>([]);

// This will be removed in the future with the innerJoin or LeftJoin
export const [studentsToSchool, setStudentsToSchool] = createSignal<
  EleveVersEtablissementType[]
>([]);

export function deselectAllPoints() {
  getLeafletSchools().map((point) => point.setSelected(false));
  getLeafletStops().map((point) => point.setSelected(false));
}
export const [pointsReady, setPointsReady] = createSignal(false);

// Props here is for storybook
interface PointsProps {
  leafletMap: L.Map;
}

export function Points(props: PointsProps) {
  createEffect(() => {
    if (
      getLeafletSchools().length == 0 ||
      !studentsToSchool() ||
      getLeafletStops().length == 0
    ) {
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
