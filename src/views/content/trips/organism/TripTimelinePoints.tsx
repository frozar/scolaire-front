import {
  For,
  Setter,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { GradeTripType } from "../../../../_entities/grade.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import { WaypointType } from "../../../../_entities/waypoint.entity";
import { OsrmService } from "../../../../_services/osrm.service";
import { SchoolStore } from "../../../../_stores/school.store";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { NatureEnum } from "../../../../type";
import { TimelineMenu } from "../molecule/TimelineMenu";
import { TripTimelinePoint } from "../molecule/TripTimelinePoint";

import { StopStore } from "../../../../_stores/stop.store";
import { TripPointUtils } from "../../../../_utils/trip-point.utils";
import { setSchoolPointOnClick } from "../../_component/molecule/SchoolPoint";
import { setStopPointOnClick } from "../../_component/molecule/StopPoint";
import { TripTimelineAddPointButton } from "../atom/TripTimelineAddPointButton";
import "./TripTimeline.css";

export function TripTimelinePoints(props: {
  trip: TripType;
  setTrip: Setter<TripType>;
  inDraw: boolean;
}) {
  const [indexOfAddPoint, setIndexOfAddPoint] = createSignal<number>(-1);

  onMount(() => {
    setStopPointOnClick(() => onUpdateStopFromMap);
    setSchoolPointOnClick(() => onUpdateStopFromMap);
  });

  onCleanup(() => {
    setStopPointOnClick();
    setSchoolPointOnClick();
  });
  createEffect(() => {
    console.log("On est là  : props.trip", props.trip);
  });

  async function onUpdateStopFromMap(stop: StopType | SchoolType) {
    const newTrip = updateTripOnMapInteraction(
      stop,
      props.trip,
      indexOfAddPoint()
    );
    const afterPoly = await updatePolylineWithOsrm(newTrip);

    setIndexOfAddPoint(-1);
    props.setTrip(afterPoly);
  }

  function onClickAddFromTimeline(index: number) {
    setIndexOfAddPoint(index);
  }

  function deletePointFromTimeline(tripPoint: TripPointType) {
    let point;
    if (tripPoint.nature == NatureEnum.stop) {
      point = StopStore.get(tripPoint.id) as StopType;
    } else {
      point = SchoolStore.get(tripPoint.id) as SchoolType;
    }
    onUpdateStopFromMap(point);
  }

  return (
    <div class="triptimeline-items ">
      <For each={props.trip.tripPoints}>
        {(currentPoint, i) => {
          const [point, setPoint] = createSignal<TripPointType>(currentPoint);

          createEffect(() => {
            const index = i();
            const _point = point();
            props.setTrip((prev) => {
              prev.tripPoints[index] = _point;
              return { ...prev };
            });
          });

          return (
            <div class="triptimeline-item">
              <Show when={props.inDraw}>
                <TripTimelineAddPointButton
                  onClickAdd={() => onClickAddFromTimeline(i())}
                  enable={indexOfAddPoint() == i()}
                />
              </Show>

              <TripTimelinePoint
                point={point()}
                tripColor={props.trip.color}
                passageTime={TripPointUtils.getCurrentPassageTime(
                  props.trip,
                  i()
                )}
                quantity={TripPointUtils.getSignedPointQuantity(
                  point(),
                  props.trip
                )}
                accumulateQuantity={TripPointUtils.getAccumulateQuantity(
                  props.trip,
                  i()
                )}
              >
                <Show when={props.inDraw}>
                  <TimelineMenu
                    //TODO keep
                    onClickDeletePoint={() => {
                      deletePointFromTimeline(point());
                    }}
                    point={point()}
                    setPoint={setPoint}
                    trip={props.trip}
                  />
                </Show>
              </TripTimelinePoint>
            </div>
          );
        }}
      </For>
    </div>
  );
}

/**
 * Add or Delete Point in Trip
 */
function updateTripOnMapInteraction(
  pointToOperate: StopType | SchoolType,
  trip: TripType,
  index = -1
) {
  const prev = { ...trip };

  const tripPointIndex = prev.tripPoints.findIndex(
    (tripPoint) => tripPoint.leafletId == pointToOperate.leafletId
  );
  if (tripPointIndex != -1) {
    prev.tripPoints.splice(tripPointIndex, 1);
  } else {
    const tripPoint: TripPointType | undefined = createNewTripPoint(
      prev,
      pointToOperate
    );
    if (tripPoint) {
      if (index == -1) {
        prev.tripPoints.push(tripPoint);
      } else {
        // ajouter tripPoint à un index précis
        prev.tripPoints.splice(index, 0, tripPoint);
      }
    } else {
      //TODO create exception : contact admin sys
    }
  }
  /**
   * Update WayPoint
   */
  if (prev.waypoints) {
    prev.waypoints = updateWaypoints(
      pointToOperate,
      prev.waypoints,
      prev.tripPoints
    );
  }

  return { ...prev };
}

function updateWaypoints(
  point: StopType | SchoolType,
  // trip: TripType,
  waypoints: WaypointType[],
  points: TripPointType[]
) {
  const newWaypoints = [...waypoints];

  const tripPointIndex = points.findIndex(
    (actualPoint) => actualPoint.id == point.id
  );
  //Ajout du way point à la fin
  if (points.length - 1 == tripPointIndex) {
    point.nature == NatureEnum.stop
      ? newWaypoints.push({
          idStop: point.id,
          lat: point.lat,
          lon: point.lon,
        })
      : newWaypoints.push({
          idSchool: point.id,
          lat: point.lat,
          lon: point.lon,
        });
    return newWaypoints;
  }

  const { firstWaypointIndex, quantityToReplace } =
    calculateStartAndQuantityWaypointToReplace(point, waypoints);

  if (tripPointIndex == -1) {
    newWaypoints.splice(firstWaypointIndex, quantityToReplace);
  } else {
    newWaypoints.splice(
      firstWaypointIndex + 1,
      quantityToReplace - 1,
      point.nature == NatureEnum.stop
        ? {
            idStop: point.id,
            lat: point.lat,
            lon: point.lon,
          }
        : {
            idSchool: point.id,
            lat: point.lat,
            lon: point.lon,
          }
    );
  }
  return newWaypoints;
}

function calculateStartAndQuantityWaypointToReplace(
  point: StopType | SchoolType,
  waypoints: WaypointType[]
): { firstWaypointIndex: number; quantityToReplace: number } {
  const waypointIndex = waypoints.findIndex((actualPoint) =>
    point.nature == NatureEnum.stop
      ? actualPoint.idStop == point.id
      : actualPoint.idSchool == point.id
  );
  let previousWaypointIndex = -1;
  let nextWaypointIndex = -1;

  for (const key in waypoints) {
    const waypoint = waypoints[key];
    if (waypoint.idSchool || waypoint.idStop) {
      if (Number(key) < waypointIndex) {
        previousWaypointIndex = Number(key);
      } else if (Number(key) > waypointIndex) {
        nextWaypointIndex = Number(key);
        break;
      }
    }
  }

  previousWaypointIndex =
    previousWaypointIndex == -1 ? waypointIndex : previousWaypointIndex;
  nextWaypointIndex =
    nextWaypointIndex == -1 ? waypointIndex : nextWaypointIndex;

  const indexDifference = nextWaypointIndex - previousWaypointIndex;

  return {
    firstWaypointIndex: waypointIndex == 0 ? 0 : previousWaypointIndex + 1,
    quantityToReplace:
      indexDifference == 1 ? indexDifference : indexDifference - 1,
  };
}

function createNewTripPointFromSchool(school: SchoolType): TripPointType {
  return {
    id: school.id,
    leafletId: school.leafletId,
    name: school.name,
    lon: school.lon,
    lat: school.lat,
    nature: school.nature,
    waitingTime: school.waitingTime,
    grades: [],
    passageTime: 0,
    startToTripPointDistance: 0,
  };
}

function createNewTripPointFromStop(
  trip: TripType,
  stop: StopType
): TripPointType {
  const gradeIds = trip.grades.map((grade) => grade.id) as number[];

  const grades: GradeTripType[] = [];
  stop.associated.map((associated) => {
    if (gradeIds.includes(associated.gradeId)) {
      grades.push({
        quantity: associated.quantity,
        gradeId: associated.gradeId,
        matrix: associated.quantityMatrix,
      });
    }
  });

  return {
    ...stop,
    grades: grades,
    passageTime: 0,
    startToTripPointDistance: 0,
  };
}

function createNewTripPoint(
  trip: TripType,
  pointType: StopType | SchoolType
): TripPointType | undefined {
  if (pointType.nature == NatureEnum.school) {
    return createNewTripPointFromSchool(pointType as SchoolType);
  } else if (pointType.nature == NatureEnum.stop) {
    return createNewTripPointFromStop(trip, pointType as StopType);
  }
  return;
}

// TODO fonction à réécrire... function dans function !!! + complexité
async function updatePolylineWithOsrm(trip: TripType) {
  enableSpinningWheel();
  const {
    latlngs,
    projectedLatlngs,
    metrics,
    legsDurations,
    legsDistances,
    //TODO ponderation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // stepsWeight,
  } = await OsrmService.getRoadPolyline(trip);

  let someDuration = 0;
  const newLegsDuration: number[] = [];

  function isWaypoint(item: WaypointType | undefined): boolean {
    return item ? !item.idSchool && !item.idStop : false;
  }

  function getCumulativeLegsDistance(waypointLength: number): number[] {
    let cumulativeDistance = 0;
    const newLegsDistance: number[] = [0]; // 0 is the first value

    for (let i = 0; i < waypointLength - 1; i++) {
      if (!isWaypoint((trip.waypoints as WaypointType[])[i])) {
        cumulativeDistance += legsDistances[i];
        newLegsDistance.push(cumulativeDistance);
      } else cumulativeDistance += legsDistances[i];
    }

    return newLegsDistance;
  }

  const size = trip.waypoints?.length as number;

  const newLegsDistance = getCumulativeLegsDistance(size);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  for (let index = 1; index <= size - 1; index++) {
    const item = trip.waypoints ? trip.waypoints[index] : undefined;
    const legsIndex = index - 1;
    const duration = legsDurations[legsIndex];

    if (!isWaypoint(item)) {
      newLegsDuration.push(duration + someDuration);
      someDuration = 0;
    } else someDuration += duration;
  }

  // * One leg_duration is the travel time between the first & second point.
  // * first tripPoint.time_passage is based on trip.start_time so no need to define it.
  // * for each another tripPoint we define the time_passage to (index - 1) of legsDuration
  trip.tripPoints.forEach((tripPoint, index) => {
    if (index > 0) {
      tripPoint.passageTime = newLegsDuration[index - 1];
    }
  });
  trip.tripPoints.forEach((tripPoint, i) => {
    tripPoint.startToTripPointDistance = newLegsDistance[i];
  });
  trip.metrics = metrics;

  trip.latLngs = latlngs;

  let waypoints = trip.waypoints;
  if (waypoints) {
    waypoints = waypoints.map((waypoint, i) => {
      if (!waypoint.onRoadLat || !waypoint.onRoadLon)
        return {
          ...waypoint,
          onRoadLat: waypoint.lat,
          onRoadLon: waypoint.lon,
        };
      return {
        ...waypoint,
        onRoadLat: projectedLatlngs[i].lat,
        onRoadLon: projectedLatlngs[i].lng,
      };
    });
    trip.waypoints = waypoints;
  }

  disableSpinningWheel();
  return { ...trip };
}
