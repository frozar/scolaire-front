import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../../../leafletUtils";
import {
  SCHOOL_READ,
  SCHOOL_READ_UNSELECTED,
  STOP_READ_UNSELECTED,
} from "../../constant";
import Point from "../atom/Point";
import {
  currentStep,
  drawModeStep,
} from "../organism/AddLineInformationBoardContent";
import { deselectAllBusLines } from "../organism/BusLines";
import {
  blinkingSchools,
  deselectAllPoints,
  setBlinkingStops,
} from "../organism/Points";
import { getStops } from "../organism/StopPoints";

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
  point: SchoolType;
  map: L.Map;
}

const onClick = (point: SchoolType) => {
  // Highlight point stops
  const ids: number[] = [point.leafletId];

  for (const associated of point.associated) {
    const school = getStops().filter((item) => item.id == associated.id)[0];
    if (school != undefined) {
      ids.push(school.leafletId);
    }
  }

  setSchoolPointsColor(ids, SCHOOL_READ_UNSELECTED);
  setStopPointsColor(ids, STOP_READ_UNSELECTED);

  if (!isInAddLineMode()) {
    deselectAllBusLines();
    deselectAllPoints();
    point.setSelected(true);
    return;
  }

  const etablissementSelected = getLineUnderConstruction().busLine.schools;

  if (currentStep() === drawModeStep.schoolSelection) {
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

const onMouseOver = (school: SchoolType) => {
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
      borderColor={SCHOOL_READ}
      fillColor={SCHOOL_READ}
      radius={12}
      weight={0}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
    />
  );
}
