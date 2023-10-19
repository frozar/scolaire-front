import { FaRegularTrashCan } from "solid-icons/fa";

import { Setter } from "solid-js";
import { RaceType } from "../../../../../_entities/trip.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { NatureEnum } from "../../../../../type";
import { linkMap } from "../../../map/component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "../../../map/constant";
import { updateWaypoints } from "../organism/DrawRaceBoard";
import "./RaceTimelineRemovePointButton.css";

export function RaceTimelineRemovePointButton(props: {
  indice: number;
  trip: RaceType;
  setRace?: Setter<RaceType>;
}) {
  const deletePoint = (indice: number) => {
    if (props.setRace) {
      const points = [...props.trip.points];
      const pointId = points[indice].id;
      const nature = points[indice].nature;

      // TODO pas de l'ordre de la timeline !!
      const circle = linkMap.get(props.trip.points[indice].leafletId);
      nature == NatureEnum.stop
        ? circle?.setStyle({ fillColor: COLOR_STOP_FOCUS })
        : circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

      points.splice(indice, 1);

      props.setRace((trip) => {
        return { ...trip, points };
      });

      // Update waypoints array
      const waypoints = props.trip.waypoints;
      if (waypoints) {
        let newWaypoints = [...waypoints];

        newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
          waypoints,
          pointId,
          nature
        );

        updateWaypoints(newWaypoints);
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
