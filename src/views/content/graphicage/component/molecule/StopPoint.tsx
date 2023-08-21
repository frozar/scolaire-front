import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import { NatureEnum } from "../../../../../type";
import { renderAnimation } from "../../animation";
import Point from "../atom/Point";
import { deselectAllBusLines } from "../organism/BusLines";
import {
  blinkingStops,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
} from "../organism/Points";
import { getSchools } from "../organism/SchoolPoints";

const [
  ,
  {
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
  for (const associated of point.associated) {
    let element;
    const school = getSchools().filter((item) => item.id == associated.id)[0];
    if (school && (element = linkMap.get(school.leafletId)?.getElement())) {
      renderAnimation(element);
    }
  }

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
      onRightClick={() => {
        const isInLineUnderConstruction =
          getLineUnderConstruction().busLine.points.filter(
            (_point) => _point.id == props.point.id
          )[0];
        if (isInAddLineMode() && isInLineUnderConstruction != undefined) {
          removePointToLineUnderConstruction({
            id: props.point.id,
            leafletId: props.point.leafletId,
            name: props.point.name,
            lon: props.point.lon,
            lat: props.point.lat,
            quantity: 0,
            nature: NatureEnum.stop,
          });
        }
      }}
    />
  );
}
