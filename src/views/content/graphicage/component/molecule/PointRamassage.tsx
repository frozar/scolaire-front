import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum } from "../../../../../type";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import Point from "../atom/Point";
import {
  blinkingStops,
  deselectAllPoints,
  setBlinkingSchools,
} from "../organism/Points";
import { LeafletStopType, ramassages } from "../organism/PointsRamassage";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export interface PointRamassageProps {
  point: LeafletStopType;
  map: L.Map;

  minQuantity: number;
  maxQuantity: number;
}
const minRadius = 5;
const maxRadius = 10;
const rangeRadius = maxRadius - minRadius;

const selectPointById = (id: number) =>
  ramassages().map((point) => point.setSelected(id == point.idPoint));

function onClick(point: LeafletStopType) {
  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    selectPointById(point.leafletId);
    return;
  }

  // TODO: when add line with an etablissement point the line destroy after next point click
  // Wait Richard/Hugo finish the line underconstruction
  // TODO utility ?
  addPointToLineUnderConstruction({
    id: point.id,
    idPoint: point.leafletId,
    nature: NatureEnum.ramassage,
  });

  if (!(1 < getLineUnderConstruction().stops.length)) {
    return;
  }

  // Highlight point ramassage
  //TODO fix with new type model
  // for (const associatedPoint of point.associatedPoints()) {
  //   let element;
  // // TODO find leafletSchool and identify leafletId
  //   if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
  //     renderAnimation(element);
  //   }
  // }
}

const onMouseOver = (point: LeafletStopType) => {
  console.log(point);
  // // TODO find leafletSchool IDs and identify leafletId
  // setBlinkingSchools(
  //   point.associatedPoints().map((associatedPoint) => associatedPoint.id)
  // );
};

const onMouseOut = () => {
  setBlinkingSchools([]);
};

export default function (props: PointRamassageProps) {
  const rad = (): number => {
    let radiusValue = minRadius;
    const quantity = props.point.associated.reduce(
      (acc, stop) => acc + stop.quantity,
      0
    );

    if (quantity && props.maxQuantity && props.minQuantity) {
      const coef =
        props.minQuantity == props.maxQuantity
          ? 0
          : (quantity - props.minQuantity) /
            (props.maxQuantity - props.minQuantity);

      radiusValue += coef * rangeRadius;
    }

    return radiusValue;
  };

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingStops().includes(props.point.id)}
      borderColor="red"
      fillColor="white"
      radius={rad()}
      weight={2}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
    />
  );
}
