import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  currentStep,
  displayLineMode,
  displayLineModeEnum,
  drawModeStep,
} from "../../../board/component/organism/DrawModeBoardContent";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { COLOR_SCHOOL_FOCUS } from "../../constant";
import { setIsOverMapItem } from "../../l7MapBuilder";
import Point from "../atom/Point";
import { deselectAllBusLines } from "../organism/BusLines";
import {
  blinkingSchools,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
  setCursorIsOverPoint,
} from "../organism/Points";
import { draggingLine, setDraggingLine } from "./BusLine";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    setLineUnderConstruction,
    removePointToLineUnderConstruction,
    // isInAddLineMode,
  },
] = useStateAction();

export interface SchoolPointProps {
  point: SchoolType;
  map: L.Map;
}

const onClick = (point: SchoolType) => {
  if (onBoard() != "line-draw") {
    deselectAllBusLines();
    deselectAllPoints();
    point.setSelected(true);
    setSchoolDetailsItem(point);
    changeBoard("school-details");
    updatePointColor(point);

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

  const waypoints = getLineUnderConstruction().busLine.waypoints;
  if (waypoints) {
    const newWaypoints = WaypointEntity.updateWaypoints(
      point,
      waypoints,
      getLineUnderConstruction().busLine.points
    );
    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: {
        ...getLineUnderConstruction().busLine,
        waypoints: newWaypoints,
      },
    });
  }

  if (displayLineMode() == displayLineModeEnum.onRoad) {
    updatePolylineWithOsrm(getLineUnderConstruction().busLine);
  }

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
  setIsOverMapItem(true);
  setBlinkingStops(school.associated.map((stop) => stop.id));

  if (draggingLine()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = () => {
  setIsOverMapItem(false);
  setBlinkingStops([]);

  if (draggingLine() || cursorIsOverPoint()) {
    setCursorIsOverPoint(false);
  }
};

const onRightClick = (point: SchoolType) => {
  const circle = linkMap.get(point.leafletId);
  const isInLineUnderConstruction =
    getLineUnderConstruction().busLine.points.filter(
      (_point) => _point.id == point.id
    )[0];

  if (onBoard() == "line-draw" && isInLineUnderConstruction != undefined) {
    removePointToLineUnderConstruction(point);
    // Update waypoints
    const waypoints = getLineUnderConstruction().busLine.waypoints;
    if (waypoints) {
      const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
        waypoints,
        point.id,
        point.nature
      );

      const newBusLine: BusLineType = {
        ...getLineUnderConstruction().busLine,
        waypoints: newWaypoints,
      };
      if (displayLineMode() == displayLineModeEnum.onRoad) {
        updatePolylineWithOsrm(newBusLine);
      } else {
        setLineUnderConstruction({
          ...getLineUnderConstruction(),
          busLine: newBusLine,
        });
      }
    }

    circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
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
      onRightClick={() => onRightClick(props.point)}
    />
  );
}
