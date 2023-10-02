import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../../../../../StateAction";
import {
  BusCourseType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-course.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { CourseUnderConstructionType, NatureEnum } from "../../../../../type";
import { linkMap } from "../../../map/component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "../../../map/constant";
import {
  displayCourseMode,
  displayCourseModeEnum,
} from "../organism/DrawModeBoardContent";
import "./TimelineRemovePointButton.css";

const [, { getCourseUnderConstruction, setCourseUnderConstruction }] =
  useStateAction();

// TODO Create stories and cypress
export function TimelineRemovePointButton(props: {
  indice: number;
  getter: () => CourseUnderConstructionType;
  setter: (line: CourseUnderConstructionType) => void;
}) {
  const deletePoint = (id: number) => {
    const stops = [...props.getter().busCourse.points];
    const pointId = stops[id].id;
    const nature = stops[id].nature;

    const circle = linkMap.get(props.getter().busCourse.points[id].leafletId);
    nature == NatureEnum.stop
      ? circle?.setStyle({ fillColor: COLOR_STOP_FOCUS })
      : circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

    stops.splice(id, 1);
    props.setter({
      ...props.getter(),
      busCourse: { ...props.getter().busCourse, points: stops },
    });

    // Update waypoints array
    const waypoints = getCourseUnderConstruction().busCourse.waypoints;
    if (waypoints) {
      let newWaypoints = [...waypoints];

      newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
        waypoints,
        pointId,
        nature
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
  };

  return (
    <button
      class="button-delete button-delete-timeline"
      onClick={() => deletePoint(props.indice)}
    >
      <FaRegularTrashCan />
    </button>
  );
}
