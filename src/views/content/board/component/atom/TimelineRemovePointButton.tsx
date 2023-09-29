import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../../../../../StateAction";
import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { LineUnderConstructionType, NatureEnum } from "../../../../../type";
import { linkMap } from "../../../map/component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "../../../map/constant";
import {
  displayLineMode,
  displayLineModeEnum,
} from "../organism/DrawModeBoardContent";
import "./TimelineRemovePointButton.css";

const [, { getLineUnderConstruction, setLineUnderConstruction }] =
  useStateAction();

// TODO Create stories and cypress
export function TimelineRemovePointButton(props: {
  indice: number;
  getter: () => LineUnderConstructionType;
  setter: (line: LineUnderConstructionType) => void;
}) {
  const deletePoint = (id: number) => {
    const stops = [...props.getter().busLine.points];
    const pointId = stops[id].id;
    const nature = stops[id].nature;

    const circle = linkMap.get(props.getter().busLine.points[id].leafletId);
    nature == NatureEnum.stop
      ? circle?.setStyle({ fillColor: COLOR_STOP_FOCUS })
      : circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

    stops.splice(id, 1);
    props.setter({
      ...props.getter(),
      busLine: { ...props.getter().busLine, points: stops },
    });

    // Update waypoints array
    const waypoints = getLineUnderConstruction().busLine.waypoints;
    if (waypoints) {
      let newWaypoints = [...waypoints];

      newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
        waypoints,
        pointId,
        nature
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
