import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../../../leafletUtils";
import {
  COLOR_SCHOOL_LIGHT,
  COLOR_STOP_FOCUS,
  COLOR_STOP_LIGHT,
} from "../../constant";
import Point from "../atom/Point";
import { deselectAllBusLines } from "../organism/BusLines";
import {
  blinkingStops,
  deselectAllPoints,
  setBlinkingSchools,
} from "../organism/Points";
import { getSchools } from "../organism/SchoolPoints";

const [
  ,
  {
    isInReadMode,
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
    removePointToLineUnderConstruction,
  },
] = useStateAction();

export interface StopPointProps {
  point: StopType;
  map: L.Map;

  minQuantity: number;
  maxQuantity: number;
}
const minRadius = 5;
const maxRadius = 10;
const rangeRadius = maxRadius - minRadius;

function onClick(point: StopType) {
  // Highlight point schools
  const ids: number[] = [point.leafletId];
  for (const associated of point.associated) {
    const leafletPoint = getSchools().filter(
      (item) => item.id == associated.id
    )[0];
    ids.push(leafletPoint.leafletId);
  }

  setSchoolPointsColor(ids, COLOR_SCHOOL_LIGHT);
  setStopPointsColor(ids, COLOR_STOP_LIGHT);

  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    point.setSelected(true);
    return;
  }

  //TODO Modify when we use multiple schools
  const associatedQuantity = point.associated.filter(
    (associatedSchool) =>
      associatedSchool.id === getLineUnderConstruction().busLine.schools[0].id
  )[0].quantity;

  // TODO: when add line with an etablissement point the line destroy after next point click
  // Wait Richard/Hugo finish the line underconstruction
  addPointToLineUnderConstruction({ ...point, quantity: associatedQuantity });

  //TODO pourquoi cette condition ?
  if (!(1 < getLineUnderConstruction().busLine.points.length)) {
    return;
  }
}

const onMouseOver = (stop: StopType) => {
  setBlinkingSchools(stop.associated.map((school) => school.id));
};

const onMouseOut = () => {
  setBlinkingSchools([]);
};

export function StopPoint(props: StopPointProps) {
  const rad = (): number => {
    if (isInReadMode()) return 5;
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

  const onRightClick = () => {
    const isInLineUnderConstruction =
      getLineUnderConstruction().busLine.points.filter(
        (_point) => _point.id == props.point.id
      )[0];
    if (isInAddLineMode() && isInLineUnderConstruction != undefined) {
      removePointToLineUnderConstruction(props.point);
    }
  };

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingStops().includes(props.point.id)}
      borderColor={COLOR_STOP_FOCUS}
      fillColor={COLOR_STOP_FOCUS}
      radius={rad()}
      weight={0}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
      onRightClick={onRightClick}
    />
  );
}
