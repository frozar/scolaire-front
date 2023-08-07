import L from "leaflet";
import { createEffect, createSignal, onMount } from "solid-js";
import { EleveVersEtablissementType } from "../../../../../type";
import { fetchEleveVersEtablissement } from "../../point.service";
import PointsEtablissement, { etablissements } from "./PointsEtablissement";
import PointsRamassage, { ramassages } from "./PointsRamassage";

export const linkMap = new Map<number, L.CircleMarker>();

export const [blinkingStops, setBlinkingStops] = createSignal<number[]>([]);

export const [blinkingSchools, setBlinkingSchools] = createSignal<number[]>([]);

// This will be removed in the future with the innerJoin or LeftJoin
export const [studentsToSchool, setStudentsToSchool] = createSignal<
  EleveVersEtablissementType[]
>([]);

// TODO to delete post Xano

export function deselectAllPoints() {
  console.log("deselectAllPoints");

  etablissements().map((point) => point.setSelected(false));
  ramassages().map((point) => point.setSelected(false));
}
export const [pointsReady, setPointsReady] = createSignal(false);

// Props here is for storybook
interface PointsProps {
  leafletMap: L.Map;
  mapId: number;
}

export default function (props: PointsProps) {
  // TODO to delete post Xano
  onMount(async () => {
    setStudentsToSchool(await fetchEleveVersEtablissement(props.mapId));
  });

  // TODO: check if necessary (similar feature already existing !)
  // createEffect(() => {
  //   if (pointsRamassageReady() && pointsEtablissementReady()) {
  //     setPointsReady(true);
  //   }
  // });

  createEffect(() => {
    if (
      etablissements().length == 0 ||
      !studentsToSchool() ||
      ramassages().length == 0
    ) {
      return;
    }

    // TODO to delete post Xano
    // setupAssociations(etablissements(), NatureEnum.etablissement);
    // setupAssociations(ramassages(), NatureEnum.ramassage);

    setPointsReady(true);
  });
  // TODO: Fix ramassages displayed over etalbissements
  return (
    <div>
      <PointsEtablissement leafletMap={props.leafletMap} mapId={props.mapId} />
      <PointsRamassage leafletMap={props.leafletMap} mapId={props.mapId} />
    </div>
  );
}
