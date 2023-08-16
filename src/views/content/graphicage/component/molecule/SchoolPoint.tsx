import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { renderAnimation } from "../../animation";
import Point from "../atom/Point";
import { deselectAllBusLines } from "../organism/BusLines";
import {
  blinkingSchools,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
} from "../organism/Points";
import { LeafletSchoolType } from "../organism/SchoolPoints";
import { getLeafletStops } from "../organism/StopPoints";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    setLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export interface SchoolPointProps {
  point: LeafletSchoolType;
  map: L.Map;
}

const onClick = (point: LeafletSchoolType) => {
  // Highlight point stops
  for (const associated of point.associated) {
    let element;
    const stop = getLeafletStops().filter(
      (item) => item.id == associated.id
    )[0];
    if (stop && (element = linkMap.get(stop.leafletId)?.getElement())) {
      renderAnimation(element);
    }
  }

  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    point.setSelected(true);
    return;
  }

  const etablissementSelected = getLineUnderConstruction().busLine.schools;

  if (!getLineUnderConstruction().confirmSelection) {
    if (etablissementSelected?.find((p) => p.id === point.id)) {
      return;
    }
    // TODO Uncomment to add "Select multiple etablissement"
    // const etablissementsSelected = !etablissementSelected
    //   ? [point]
    //   : etablissementSelected.concat(point);

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: { ...getLineUnderConstruction().busLine, schools: [point] },
    });

    return;
  }

  addPointToLineUnderConstruction({ ...point, quantity: 0 });

  //TODO pourquoi cette condition ?
  if (!(1 < getLineUnderConstruction().busLine.points.length)) {
    return;
  }
};

const onMouseOver = (school: LeafletSchoolType) => {
  setBlinkingStops(school.associated.map((stop) => stop.id));
};

const onMouseOut = () => {
  setBlinkingStops([]);
};

export function SchoolPoint(props: SchoolPointProps) {
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
