import { FaRegularTrashCan } from "solid-icons/fa";

import { SetStoreFunction } from "solid-js/store";
import { RaceType } from "../../../../../_entities/race.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { NatureEnum } from "../../../../../type";
import { linkMap } from "../../../map/component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "../../../map/constant";
import { updateWaypoints } from "../organism/DrawModeBoardContent";
import "./RaceTimelineRemovePointButton.css";

export function RaceTimelineRemovePointButton(props: {
  indice: number;
  race: RaceType;
  setRace?: SetStoreFunction<RaceType>;
}) {
  const deletePoint = (indice: number) => {
    if (props.setRace) {
      const points = [...props.race.points];
      const pointId = points[indice].id;
      const nature = points[indice].nature;

      // TODO pas de l'ordre de la timeline !!
      const circle = linkMap.get(props.race.points[indice].leafletId);
      nature == NatureEnum.stop
        ? circle?.setStyle({ fillColor: COLOR_STOP_FOCUS })
        : circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

      points.splice(indice, 1);

      props.setRace("points", points);

      // Update waypoints array
      const waypoints = props.race.waypoints;
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
