import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum } from "../../../../../type";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import Point from "../atom/Point";
import {
  blinkingStops,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
} from "../organism/Points";
import { getLeafletSchools } from "../organism/PointsEtablissement";
import { LeafletStopType, getLeafletStops } from "../organism/PointsRamassage";

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
  getLeafletStops().map((point) => point.setSelected(id == point.leafletId));

function onClick(point: LeafletStopType) {
  // Highlight point schools
  for (const associated of point.associated) {
    let element;
    const school = getLeafletSchools().filter(
      (item) => item.id == associated.id
    )[0];
    if (school && (element = linkMap.get(school.leafletId)?.getElement())) {
      renderAnimation(element);
    }
  }

  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    // point.setSelected(true);
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

  //TODO pourquoi cette condition ?
  if (!(1 < getLineUnderConstruction().stops.length)) {
    return;
  }
}

const onMouseOver = (stop: LeafletStopType) => {
  setBlinkingSchools(stop.associated.map((school) => school.id));
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
