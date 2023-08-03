import L from "leaflet";
import { Accessor, createEffect, createSignal, onMount } from "solid-js";
import { EleveVersEtablissementType, NatureEnum } from "../../../../../type";
import { fetchEleveVersEtablissement } from "../../point.service";
import { PointIdentityType, PointInterface } from "../atom/Point";
import PointsEtablissement, { etablissements } from "./PointsEtablissement";
import PointsRamassage, { ramassages } from "./PointsRamassage";

export const linkMap = new Map<number, L.CircleMarker>();

export const [blinkingPoints, setBlinkingPoint] = createSignal<number[]>([]);
export const setBlinking = (
  associatedPoints: Accessor<PointIdentityType[]>
) => {
  const toBlink: number[] = [];
  for (const associatedPoint of associatedPoints()) {
    toBlink.push(associatedPoint.idPoint);
  }
  setBlinkingPoint(toBlink);
};

// This will be removed in the future with the innerJoin or LeftJoin
export const [studentsToSchool, setStudentsToSchool] = createSignal<
  EleveVersEtablissementType[]
>([]);

const setupAssociations = (points: PointInterface[], nature: NatureEnum) => {
  for (const point of points) {
    const associatedPoints = studentsToSchool().filter(
      (elt) =>
        point.id ===
        (nature === NatureEnum.ramassage
          ? elt.ramassage_id
          : elt.etablissement_id)
    );

    point.setAssociatedPoints(
      associatedPoints.map((elt) => {
        const associatedId =
          nature === NatureEnum.ramassage
            ? elt.etablissement_id
            : elt.ramassage_id;

        const associatedNature =
          nature === NatureEnum.ramassage
            ? NatureEnum.etablissement
            : NatureEnum.ramassage;

        const id_point =
          associatedNature === NatureEnum.etablissement
            ? elt.etablissement_id_point
            : elt.ramassage_id_point;

        return {
          id: associatedId,
          idPoint: id_point,
          nature: associatedNature,
        };
      })
    );
  }
};

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

    setupAssociations(etablissements(), NatureEnum.etablissement);
    setupAssociations(ramassages(), NatureEnum.ramassage);

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
