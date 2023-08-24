import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../../../leafletUtils";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_SCHOOL_LIGHT,
  COLOR_STOP_LIGHT,
} from "../../constant";
import Point from "../atom/Point";
// import {
//   currentStep,
//   drawModeStep,
// } from "../organism/AddLineInformationBoardContent";
import { deselectAllBusLines } from "../organism/BusLines";
import { currentStep, drawModeStep } from "../organism/DrawModeBoardContent";
import {
  blinkingSchools,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
  setCursorIsOverPoint,
} from "../organism/Points";
import { getStops } from "../organism/StopPoints";
import { draggingLine, setDraggingLine } from "./BusLine";

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
  const ids: number[] = [point.leafletId];

  for (const associated of point.associated) {
    const school = getStops().filter((item) => item.id == associated.id)[0];
    if (school != undefined) {
      ids.push(school.leafletId);
    }
  }

  const circle = linkMap.get(point.leafletId);
  circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

  setSchoolPointsColor(ids, COLOR_SCHOOL_LIGHT);
  setStopPointsColor(ids, COLOR_STOP_LIGHT);

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

const onMouseUp = (point: StopType) => {
  if (draggingLine()) {
    const associatedQuantity = point.associated.filter(
      (associatedSchool) =>
        associatedSchool.id === getLineUnderConstruction().busLine.schools[0].id
    )[0].quantity;

    addPointToLineUnderConstruction({ ...point, quantity: associatedQuantity });
    setDraggingLine(false);
  }
};

const onMouseOver = (school: SchoolType) => {
  setBlinkingStops(school.associated.map((stop) => stop.id));

  if (draggingLine()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = () => {
  setBlinkingStops([]);

  if (draggingLine() || cursorIsOverPoint()) {
    setCursorIsOverPoint(false);
  }
};

export function SchoolPoint(props: SchoolPointProps) {
  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingSchools().includes(props.point.id)}
      borderColor={COLOR_SCHOOL_FOCUS}
      fillColor={COLOR_SCHOOL_FOCUS}
      radius={12}
      weight={0}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
      onMouseUp={() => onMouseUp(props.point)}
    />
  );
}
