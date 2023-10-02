import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import { COLOR_STOP_FOCUS, COLOR_STOP_LIGHT } from "../../constant";
import Point from "../atom/Point";
import { deselectAllBusCourses } from "../organism/BusCourses";

import {
  BusCourseType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-course.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  displayCourseMode,
  displayCourseModeEnum,
} from "../../../board/component/organism/DrawModeBoardContent";
import { setStopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { setIsOverMapItem } from "../../l7MapBuilder";
import {
  blinkingStops,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
  setCursorIsOverPoint,
} from "../organism/Points";
import { draggingCourse, setDraggingCourse } from "./BusCourse";

const [
  ,
  {
    isInReadMode,
    addPointToCourseUnderConstruction,
    getCourseUnderConstruction,
    isInAddCourseMode,
    removePointToCourseUnderConstruction,
    setCourseUnderConstruction,
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

//TODO Modify when we use multiple schools
function getAssociatedQuantity(point: StopType) {
  return point.associated.filter(
    (associatedSchool) =>
      associatedSchool.id ===
      getCourseUnderConstruction().busCourse.schools[0].id
  )[0].quantity;
}

function updateWaypoints(point: StopType) {
  const actualWaypoints = getCourseUnderConstruction().busCourse.waypoints;
  if (actualWaypoints) {
    const waypoints = WaypointEntity.updateWaypoints(
      point,
      actualWaypoints,
      getCourseUnderConstruction().busCourse.points
    );
    setCourseUnderConstruction({
      ...getCourseUnderConstruction(),
      busCourse: {
        ...getCourseUnderConstruction().busCourse,
        waypoints,
      },
    });
  }
}

function onClick(point: StopType) {
  if (onBoard() != "line-draw") {
    deselectAllBusCourses();
    deselectAllPoints();
    point.setSelected(true);
    setStopDetailsItem(point);
    changeBoard("stop-details");
    updatePointColor(point);

    return;
  }

  const associatedQuantity = getAssociatedQuantity(point);

  // TODO: when add line with an etablissement point the line destroy after next point click
  // Wait Richard/Hugo finish the line underconstruction
  const lastPoint = getCourseUnderConstruction().busCourse.points.at(-1);
  addPointToCourseUnderConstruction({ ...point, quantity: associatedQuantity });
  if (!lastPoint || point.leafletId != lastPoint.leafletId) {
    updateWaypoints(point);
    if (displayCourseMode() == displayCourseModeEnum.onRoad) {
      updatePolylineWithOsrm(getCourseUnderConstruction().busCourse);
    }
  }

  //TODO pourquoi cette condition ?
  if (!(1 < getCourseUnderConstruction().busCourse.points.length)) {
    return;
  }
}

const onMouseOver = (stop: StopType) => {
  setIsOverMapItem(true);
  setBlinkingSchools(stop.associated.map((school) => school.id));

  if (draggingCourse()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = () => {
  setIsOverMapItem(false);
  setBlinkingSchools([]);

  if (draggingCourse() || cursorIsOverPoint()) {
    setCursorIsOverPoint(false);
  }
};

const onMouseUp = (point: StopType) => {
  if (draggingCourse()) {
    const associatedQuantity = getAssociatedQuantity(point);

    addPointToCourseUnderConstruction({
      ...point,
      quantity: associatedQuantity,
    });
    updateWaypoints(point);

    setDraggingCourse(false);
  }
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
    const circle = linkMap.get(props.point.leafletId);
    const isInCourseUnderConstruction =
      getCourseUnderConstruction().busCourse.points.filter(
        (_point) => _point.id == props.point.id
      )[0];

    if (onBoard() == "line-draw" && isInCourseUnderConstruction != undefined) {
      removePointToCourseUnderConstruction(props.point);
      // Update waypoints
      const waypoints = getCourseUnderConstruction().busCourse.waypoints;
      if (waypoints) {
        const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
          waypoints,
          props.point.id,
          props.point.nature
        );

        const newBusCourse: BusCourseType = {
          ...getCourseUnderConstruction().busCourse,
          waypoints: newWaypoints,
        };
        if (displayCourseMode() == displayCourseModeEnum.onRoad) {
          updatePolylineWithOsrm(newBusCourse);
        } else {
          setCourseUnderConstruction({
            ...getCourseUnderConstruction(),
            busCourse: newBusCourse,
          });
        }
      }

      circle?.setStyle({ fillColor: COLOR_STOP_FOCUS });
    }
  };

  const color = () => {
    if (isInAddCourseMode()) {
      return COLOR_STOP_LIGHT;
    } else return COLOR_STOP_FOCUS;
  };

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingStops().includes(props.point.id)}
      borderColor={color()}
      fillColor={color()}
      radius={rad()}
      weight={0}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
      onRightClick={onRightClick}
      onMouseUp={() => onMouseUp(props.point)}
    />
  );
}
