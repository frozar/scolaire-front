import { FaRegularTrashCan } from "solid-icons/fa";

import { Setter } from "solid-js";
import { TripType } from "../../../../../_entities/trip.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { NatureEnum } from "../../../../../type";
import { CurrentDrawTripUtils } from "../../../../../utils/currentDrawTrip.utils";
import { linkMap } from "../../../map/component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "../../../map/constant";
import "./TripTimelineRemovePointButton.css";

export function TripTimelineRemovePointButton(props: {
  indice: number;
  trip: TripType;
  setTrip?: Setter<TripType>;
}) {
  const deletePoint = (indice: number) => {
    if (props.setTrip) {
      const points = [...props.trip.tripPoints];
      const pointId = points[indice].id;
      const pointNature = points[indice].nature;

      // TODO pas de l'ordre de la timeline !!
      const circle = linkMap.get(props.trip.tripPoints[indice].leafletId);
      pointNature == NatureEnum.stop
        ? circle?.setStyle({ fillColor: COLOR_STOP_FOCUS })
        : circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

      points.splice(indice, 1);

      props.setTrip((trip) => {
        return { ...trip, points };
      });

      // Update waypoints array
      const waypoints = props.trip.waypoints;
      if (waypoints) {
        let newWaypoints = [...waypoints];

        newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
          waypoints,
          pointId,
          pointNature
        );

        CurrentDrawTripUtils.updateWaypoints(newWaypoints);

        CurrentDrawTripUtils.removeTripPoint(pointId, pointNature);
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
