import L from "leaflet";
import { createEffect } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
  setaddLineSelectedSchool,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawModeStep,
  addPointToRace,
  addSchoolToRace,
  currentRace,
  currentStep,
  removePoint,
  updateWaypoints,
} from "../../../board/component/organism/DrawRaceBoard";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { COLOR_SCHOOL_FOCUS, COLOR_SCHOOL_LIGHT } from "../../constant";
import { setIsOverMapItem } from "../../l7MapBuilder";
import Point from "../atom/Point";
import {
  blinkingSchools,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
  setCursorIsOverPoint,
} from "../organism/Points";
import { deselectAllRaces } from "../organism/Races";
import { draggingCourse, setDraggingCourse } from "./Race";

export interface SchoolPointProps {
  point: SchoolType;
  map: L.Map;
}

const onClick = (point: SchoolType) => {
  if (onBoard() != "race-draw") {
    deselectAllRaces();
    deselectAllPoints();
    point.setSelected(true);
    setSchoolDetailsItem(point);
    changeBoard("school-details");
    updatePointColor(point);

    return;
  }

  const schoolsSelected = currentRace.schools;
  if (
    onBoard() == "line-add" &&
    addLineCurrentStep() == AddLineStep.schoolSelection
  ) {
    console.log(
      "addLineSelectedSchool",
      addLineSelectedSchool().includes(point)
    );

    const currentSelectedSchools = [...addLineSelectedSchool()];

    const index = currentSelectedSchools.indexOf(point, 0);

    const circle = linkMap.get(point.leafletId);

    if (index > -1) {
      currentSelectedSchools.splice(index, 1);
      setaddLineSelectedSchool(currentSelectedSchools);
      circle?.setStyle({ fillColor: COLOR_SCHOOL_LIGHT });
    } else {
      setaddLineSelectedSchool([...currentSelectedSchools, point]);
      circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
    }
  }
  if (onBoard() == "line-add" && addLineCurrentStep() == AddLineStep.editLine) {
    console.log("No action in this mode ");
    return;
  }

  if (currentStep() === DrawModeStep.schoolSelection) {
    if (schoolsSelected?.find((p) => p.id === point.id)) {
      return;
    }
    addSchoolToRace(point);
    return;
  }
  const lastPoint = currentRace.points.at(-1);

  // TODO  add quantity pour school ?!
  addPointToRace({
    ...point,
    quantity: 0,
  });

  if (!lastPoint || point.leafletId != lastPoint.leafletId) {
    const waypoints = currentRace.waypoints;
    if (waypoints) {
      const newWaypoints = WaypointEntity.updateWaypoints(
        point,
        waypoints,
        currentRace.points
      );

      updateWaypoints(newWaypoints);
    }
  }

  //TODO pourquoi cette condition ?
  if (!(1 < currentRace.points.length)) {
    return;
  }
};

const onMouseUp = (point: StopType) => {
  if (draggingCourse()) {
    const associatedQuantity = point.associated.filter(
      (associatedSchool) => associatedSchool.id === currentRace.schools[0].id
    )[0].quantity;

    // TODO  add quantity pour school ?!
    addPointToRace({
      ...point,
      quantity: associatedQuantity,
    });
    setDraggingCourse(false);
  }
};

const onMouseOver = (school: SchoolType) => {
  setIsOverMapItem(true);
  setBlinkingStops(school.associated.map((stop) => stop.id));

  if (draggingCourse()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = () => {
  setIsOverMapItem(false);
  setBlinkingStops([]);

  if (draggingCourse() || cursorIsOverPoint()) {
    setCursorIsOverPoint(false);
  }
};

const onRightClick = (point: SchoolType) => {
  const circle = linkMap.get(point.leafletId);
  const isInCourseUnderConstruction = currentRace.points.filter(
    (_point) => _point.id == point.id
  )[0];

  if (onBoard() == "race-draw" && isInCourseUnderConstruction != undefined) {
    removePoint(point);

    const waypoints = currentRace.waypoints;
    if (waypoints) {
      const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
        waypoints,
        point.id,
        point.nature
      );
      updateWaypoints(newWaypoints);
    }

    circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
  }
};

export function SchoolPoint(props: SchoolPointProps) {
  createEffect(() => {
    //TODO dont Work
    console.log(
      "addline",
      addLineCurrentStep() === AddLineStep.schoolSelection
    );
    if (addLineCurrentStep() === AddLineStep.schoolSelection) {
      const stopFiltering = addLineSelectedSchool().filter(
        (school) => school.id == props.point.id
      );
      const circle = linkMap.get(props.point.leafletId);
      if (stopFiltering.length > 0) {
        circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
      } else {
        circle?.setStyle({ fillColor: COLOR_SCHOOL_LIGHT });
      }
    }
  });

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
