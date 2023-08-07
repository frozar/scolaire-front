import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import Point from "../atom/Point";
import {
  blinkingSchools,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
} from "../organism/Points";
import { LeafletSchoolType } from "../organism/PointsEtablissement";
import { getLeafletStops } from "../organism/PointsRamassage";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    setLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export interface PointEtablissementProps {
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

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      etablissementSelected: [point],
    });

    return;
  }

  // TODO: check how manage line underconstuction with ramassages/etablissement signals
  addPointToLineUnderConstruction(point);

  //TODO pourquoi cette condition ?
  if (!(1 < getLineUnderConstruction().stops.length)) {
    return;
  }
};

const onMouseOver = (school: LeafletSchoolType) => {
  setBlinkingStops(school.associated.map((stop) => stop.id));
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
