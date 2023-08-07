import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { EleveVersEtablissementType } from "../../../../../type";
import PointsEtablissement, {
  etablissements,
  getLeafletSchools,
} from "./PointsEtablissement";
import PointsRamassage, {
  getLeafletStops,
  ramassages,
} from "./PointsRamassage";

export const linkMap = new Map<number, L.CircleMarker>();

export const [blinkingStops, setBlinkingStops] = createSignal<number[]>([]);

export const [blinkingSchools, setBlinkingSchools] = createSignal<number[]>([]);

// This will be removed in the future with the innerJoin or LeftJoin
export const [studentsToSchool, setStudentsToSchool] = createSignal<
  EleveVersEtablissementType[]
>([]);

// TODO to delete post Xano

export function deselectAllPoints() {
  getLeafletSchools().map((point) => point.setSelected(false));
  getLeafletStops().map((point) => point.setSelected(false));
}
export const [pointsReady, setPointsReady] = createSignal(false);

// Props here is for storybook
interface PointsProps {
  leafletMap: L.Map;
  mapId: number;
}

export default function (props: PointsProps) {
  createEffect(() => {
    if (
      etablissements().length == 0 ||
      !studentsToSchool() ||
      ramassages().length == 0
    ) {
      return;
    }

    setPointsReady(true);
  });
  return (
    <div>
      <PointsRamassage leafletMap={props.leafletMap} mapId={props.mapId} />
      <PointsEtablissement leafletMap={props.leafletMap} mapId={props.mapId} />
    </div>
  );
}
