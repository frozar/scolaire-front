import L, { LeafletMouseEvent } from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum } from "../../../../../type";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import Point, { PointInterface } from "../atom/Point";
import {
  blinkingPoints,
  deselectAllPoints,
  linkMap,
  setBlinking,
  setBlinkingPoint,
} from "../organism/Points";
import { etablissements } from "../organism/PointsEtablissement";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
    setLineUnderConstruction,
  },
] = useStateAction();

export interface PointEtablissementProps {
  point: PointInterface;
  map: L.Map;
}
const selectPointById = (id: number) =>
  etablissements().map((point) => point.setSelected(id == point.idPoint));

const onClick = (point: PointInterface) => {
  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    selectPointById(point.idPoint);
    return;
  }

  const etablissementSelected =
    getLineUnderConstruction().etablissementSelected;

  if (!getLineUnderConstruction().confirmSelection) {
    if (etablissementSelected?.find((p) => p.idPoint === point.idPoint)) {
      return;
    }
    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      etablissementSelected: !etablissementSelected
        ? [point]
        : etablissementSelected.concat(point),
    });

    return;
  }

  // TODO: check how manage line underconstuction with ramassages/etablissement signals
  addPointToLineUnderConstruction({
    id: point.id,
    idPoint: point.idPoint,
    nature: NatureEnum.etablissement,
  });

  if (!(1 < getLineUnderConstruction().stops.length)) {
    return;
  }

  // TODO: check utility
  // Highlight point ramassage
  for (const associatedPoint of point.associatedPoints()) {
    let element;
    if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
      renderAnimation(element);
    }
  }
};

const onDBLClick = (event: LeafletMouseEvent) => {
  L.DomEvent.stopPropagation(event);
};

const onMouseOver = (point: PointInterface) => {
  setBlinking(point.associatedPoints);
};

const onMouseOut = () => {
  setBlinkingPoint([]);
};

export default function (props: PointEtablissementProps) {
  return (
    <Point
      {...props}
      isBlinking={blinkingPoints().includes(props.point.idPoint)}
      borderColor="green"
      fillColor="white"
      radius={12}
      weight={4}
      onClick={() => onClick(props.point)}
      onDBLClick={onDBLClick}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
    />
  );
}
