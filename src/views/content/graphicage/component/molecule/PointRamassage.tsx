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
import { ramassages } from "../organism/PointsRamassage";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export interface PointRamassageProps {
  point: PointInterface;
  map: L.Map;

  minQuantity: number;
  maxQuantity: number;
}
const minRadius = 5;
const maxRadius = 10;
const rangeRadius = maxRadius - minRadius;

const selectPointById = (id: number) =>
  ramassages().map((point) => point.setSelected(id == point.idPoint));

function onClick(point: PointInterface) {
  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    selectPointById(point.idPoint);
    return;
  }

  // TODO: when add line with an etablissement point the line destroy after next point click
  // Wait Richard/Hugo finish the line underconstruction
  addPointToLineUnderConstruction({
    id: point.id,
    idPoint: point.idPoint,
    nature: NatureEnum.ramassage,
  });

  if (!(1 < getLineUnderConstruction().stops.length)) {
    return;
  }

  // Highlight point ramassage
  for (const associatedPoint of point.associatedPoints()) {
    let element;
    if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
      renderAnimation(element);
    }
  }
}

function onDBLClick(event: LeafletMouseEvent) {
  L.DomEvent.stopPropagation(event);
}

const onMouseOver = (point: PointInterface) => {
  setBlinking(point.associatedPoints);
};

const onMouseOut = () => {
  setBlinkingPoint([]);
};

export default function (props: PointRamassageProps) {
  const rad = (): number => {
    let radiusValue = minRadius;

    if (props.point.quantity && props.maxQuantity && props.minQuantity) {
      const coef =
        props.minQuantity == props.maxQuantity
          ? 0
          : (props.point.quantity - props.minQuantity) /
            (props.maxQuantity - props.minQuantity);

      radiusValue += coef * rangeRadius;
    }

    return radiusValue;
  };

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingPoints().includes(props.point.idPoint)}
      borderColor="red"
      fillColor="white"
      radius={rad()}
      weight={2}
      onClick={() => onClick(props.point)}
      onDBLClick={onDBLClick}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
    />
  );
}
