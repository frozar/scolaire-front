import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../../../../../StateAction";
import {
  WaypointType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { LineUnderConstructionType } from "../../../../../type";
import { linkMap } from "../../../map/component/organism/Points";
import { COLOR_STOP_LIGHT } from "../../../map/constant";
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
    const circle = linkMap.get(props.getter().busLine.points[id].leafletId);
    circle?.setStyle({ fillColor: COLOR_STOP_LIGHT });

    const stops = [...props.getter().busLine.points];
    const pointId = stops[id].id;
    stops.splice(id, 1);
    props.setter({
      ...props.getter(),
      busLine: { ...props.getter().busLine, points: stops },
    });

    // Update waypoints array
    // ! Déplacer dans WaypointEntity
    if (getLineUnderConstruction().busLine.waypoints) {
      const newWaypoints = [
        ...(getLineUnderConstruction().busLine.waypoints as WaypointType[]),
      ];

      newWaypoints.splice(
        newWaypoints.findIndex((waypoint) => waypoint.idStop == pointId),
        1
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
