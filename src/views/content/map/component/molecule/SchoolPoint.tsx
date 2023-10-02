import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import {
  CourseType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/course.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  currentStep,
  displayCourseMode,
  displayCourseModeEnum,
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
import { deselectAllCourses } from "../organism/Courses";
import {
  blinkingSchools,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
  setCursorIsOverPoint,
} from "../organism/Points";
import { draggingCourse, setDraggingCourse } from "./Course";

const [
  ,
  {
    addPointToCourseUnderConstruction,
    getCourseUnderConstruction,
    setCourseUnderConstruction,
    removePointToCourseUnderConstruction,
    // isInAddCourseMode,
  },
] = useStateAction();

export interface SchoolPointProps {
  point: SchoolType;
  map: L.Map;
}

const onClick = (point: SchoolType) => {
  if (onBoard() != "line-draw") {
    deselectAllCourses();
    deselectAllPoints();
    point.setSelected(true);
    setSchoolDetailsItem(point);
    changeBoard("school-details");
    updatePointColor(point);

    return;
  }

  const etablissementSelected = getCourseUnderConstruction().course.schools;

  if (currentStep() === drawModeStep.schoolSelection) {
    if (etablissementSelected?.find((p) => p.id === point.id)) {
      return;
    }
    // TODO Uncomment to add "Select multiple etablissement"
    // const etablissementsSelected = !etablissementSelected
    //   ? [point]
    //   : etablissementSelected.concat(point);

    setCourseUnderConstruction({
      ...getCourseUnderConstruction(),
      course: {
        ...getCourseUnderConstruction().course,
        schools: [point],
      },
    });

    return;
  }
  const lastPoint = getCourseUnderConstruction().course.points.at(-1);
  addPointToCourseUnderConstruction({ ...point, quantity: 0 });
  if (!lastPoint || point.leafletId != lastPoint.leafletId) {
    const waypoints = getCourseUnderConstruction().course.waypoints;
    if (waypoints) {
      const newWaypoints = WaypointEntity.updateWaypoints(
        point,
        waypoints,
        getCourseUnderConstruction().course.points
      );
      setCourseUnderConstruction({
        ...getCourseUnderConstruction(),
        course: {
          ...getCourseUnderConstruction().course,
          waypoints: newWaypoints,
        },
      });
    }
    if (displayCourseMode() == displayCourseModeEnum.onRoad) {
      updatePolylineWithOsrm(getCourseUnderConstruction().course);
    }
  }

  //TODO pourquoi cette condition ?
  if (!(1 < getCourseUnderConstruction().course.points.length)) {
    return;
  }
};

const onMouseUp = (point: StopType) => {
  if (draggingCourse()) {
    const associatedQuantity = point.associated.filter(
      (associatedSchool) =>
        associatedSchool.id ===
        getCourseUnderConstruction().course.schools[0].id
    )[0].quantity;

    addPointToCourseUnderConstruction({
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
  const isInCourseUnderConstruction =
    getCourseUnderConstruction().course.points.filter(
      (_point) => _point.id == point.id
    )[0];

  if (onBoard() == "line-draw" && isInCourseUnderConstruction != undefined) {
    removePointToCourseUnderConstruction(point);
    // Update waypoints
    const waypoints = getCourseUnderConstruction().course.waypoints;
    if (waypoints) {
      const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
        waypoints,
        point.id,
        point.nature
      );

      const newBusCourse: CourseType = {
        ...getCourseUnderConstruction().course,
        waypoints: newWaypoints,
      };
      if (displayCourseMode() == displayCourseModeEnum.onRoad) {
        updatePolylineWithOsrm(newBusCourse);
      } else {
        setCourseUnderConstruction({
          ...getCourseUnderConstruction(),
          course: newBusCourse,
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
