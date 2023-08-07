import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum } from "../../../../../type";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import Point from "../atom/Point";
import {
  blinkingSchools,
  deselectAllPoints,
  setBlinkingStops,
} from "../organism/Points";
import {
  LeafletSchoolType,
  etablissements,
} from "../organism/PointsEtablissement";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export interface PointEtablissementProps {
  point: LeafletSchoolType;
  map: L.Map;
}
const selectPointById = (id: number) =>
  etablissements().map((point) => point.setSelected(id == point.idPoint));

const onClick = (point: LeafletSchoolType) => {
  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    selectPointById(point.leafletId);
    return;
  }

  const etablissementSelected =
    getLineUnderConstruction().etablissementSelected;

  if (!getLineUnderConstruction().confirmSelection) {
    if (etablissementSelected?.find((p) => p.id === point.id)) {
      return;
    }
    // TODO Uncomment to add "Select multiple etablissement"
    // const etablissementsSelected = !etablissementSelected
    //   ? [point]
    //   : etablissementSelected.concat(point);

    // TODO
    // setLineUnderConstruction({
    //   ...getLineUnderConstruction(),
    //   etablissementSelected: [point],
    // });

    return;
  }

  // TODO: check how manage line underconstuction with ramassages/etablissement signals
  // TODO utility ?
  addPointToLineUnderConstruction({
    id: point.id,
    idPoint: point.leafletId,
    nature: NatureEnum.etablissement,
  });

  if (!(1 < getLineUnderConstruction().stops.length)) {
    return;
  }

  // TODO: check utility
  // Highlight point ramassage
  //TODO fix with new type model
  // for (const associatedPoint of point.associatedPoints()) {
  //   let element;
  // // TODO find leafletSchool and identify leafletId
  //   if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
  //     renderAnimation(element);
  //   }
  // }
};

const onMouseOver = (point: LeafletSchoolType) => {
  console.log(point);
  // // TODO find leafletSchool IDs and identify leafletId
  // setBlinkingStops(
  //   point.associatedPoints().map((associatedPoint) => associatedPoint.id)
  // );
};

const onMouseOut = () => {
  setBlinkingStops([]);
};

export default function (props: PointEtablissementProps) {
  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingSchools().includes(props.point.id)}
      borderColor="green"
      fillColor="white"
      radius={12}
      weight={4}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
    />
  );
}
