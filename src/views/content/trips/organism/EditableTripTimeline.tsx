import { For, Setter } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../type";
import { TripUtils } from "../../../../utils/trip.utils";
import { TripTimelineAddPointButton } from "../../board/component/atom/TripTimelineAddPointButton";
import { TripTimelineItem } from "../molecule/TripTimelinePoint";

export function EditableTripTimeline(props: {
  trip: TripType;
  setTrip: Setter<TripType>;
  // onUpdate: (trip: TripType) => void;
}) {
  function deletePoint(indice: number) {
    //maj le trip -> tripPoints en enlevant le tripPoint à delete

    // maj des waypoint

    props.setTrip((trip) => {
      const tripPoints = [...trip.tripPoints];
      const deletedTripPoint = tripPoints.slice(indice, 1)[0];
      trip.tripPoints = tripPoints;

      const wayPoints = trip.waypoints ? [...trip.waypoints] : [];
      const toDeleteWaypointIndice = wayPoints.findIndex((wayPoint) => {
        if (deletedTripPoint.nature == NatureEnum.stop) {
          return wayPoint.idStop == deletedTripPoint.id;
        } else {
          return wayPoint.idSchool == deletedTripPoint.id;
        }
      });
      wayPoints.splice(toDeleteWaypointIndice, 1);
      trip.waypoints = wayPoints;

      return trip;
    });
    // TODO pas de l'ordre de la timeline !! => doit être fait dans le stop point avec condition de couleur
    // const circle = linkMap.get(props.trip.tripPoints[indice].leafletId);
    // pointNature == NatureEnum.stop
    //   ? circle?.setStyle({ fillColor: COLOR_STOP_FOCUS })
    //   : circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

    // CurrentDrawTripUtils.updateWaypoints(newWaypoints);
    // CurrentDrawTripUtils.removeTripPoint(pointId, pointNature);
  }

  function onClickWaitingTime(indice: number, newValue: number) {
    // const points = [...props.trip.tripPoints];
    // const point = points[indice];
    // setCurrentDrawTrip((prev) => {
    //   if (!prev) return prev;
    //   return {
    //     ...prev,
    //     tripPoints: prev.tripPoints.map((point_) => {
    //       if (point_.id == point.id) point_.waitingTime = newValue;
    //       return point_;
    //     }),
    //   };
    // });
  }

  return (
    <div class="timeline">
      <div
        class="timeline-items "
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.trip.tripPoints}>
          {(tripPoint, i) => (
            <div class="timeline-block">
              <TripTimelineAddPointButton indice={i()} />

              <TripTimelineItem
                // tripPoint={point}
                // indice={i()}
                // trip={props.trip}
                // setTrip={props.setTrip}

                pointNature={tripPoint.nature}
                pointName={tripPoint.name}
                tripColor={props.trip.color}
                timePassage={TripUtils.getTimePassage(
                  i(),
                  props.trip,
                  tripPoint
                )}
                editMode={true}
                calculatedQuantity={0}
                quantityToGetOrDrop={"0"}
                // calculatedQuantity={quantity()}
                // quantityToGetOrDrop={getToCalculQuantity()}
                onClickRemovePointFromTrip={() => deletePoint(i())}
                waitingTime={tripPoint.waitingTime}
                onClickWaitingTime={(value: number) =>
                  onClickWaitingTime(i(), value)
                }
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
