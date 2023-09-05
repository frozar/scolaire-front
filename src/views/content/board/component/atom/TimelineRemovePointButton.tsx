import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../../../../../StateAction";
import { WaypointType } from "../../../../../_entities/bus-line.entity";
import { LineUnderConstructionType } from "../../../../../type";
import { linkMap } from "../../../graphicage/component/organism/Points";
import { COLOR_STOP_LIGHT } from "../../../graphicage/constant";
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
    const newWaypoints = [
      ...(getLineUnderConstruction().busLine.waypoints as WaypointType[]),
    ];
    if (newWaypoints) {
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
