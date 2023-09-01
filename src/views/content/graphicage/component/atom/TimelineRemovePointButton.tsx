import { FaRegularTrashCan } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { LineUnderConstructionType } from "../../../../../type";
import { COLOR_STOP_LIGHT } from "../../constant";
import { linkMap } from "../organism/Points";
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
    const pointId = stops[id].id; // ! bizare
    stops.splice(id, 1);
    props.setter({
      ...props.getter(),
      busLine: { ...props.getter().busLine, points: stops },
    });

    const waypoints = getLineUnderConstruction().busLine.waypoints;
    if (waypoints) {
      const waypointIndex = waypoints.findIndex(
        (waypoint) => waypoint.idStop == pointId
      );

      const newWaypoints = [...waypoints];
      newWaypoints.splice(waypointIndex, 1);

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
