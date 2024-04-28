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
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import { WaypointType } from "../../../../_entities/waypoint.entity";
import { OsrmService } from "../../../../_services/osrm.service";
import { SchoolStore } from "../../../../_stores/school.store";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { NatureEnum } from "../../../../type";
import { setSchoolPointOnClick } from "../../_component/molecule/SchoolPoint";
import { setStopPointOnClick } from "../../_component/molecule/StopPoint";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import { TripTimelineAddPointButton } from "../../board/component/atom/TripTimelineAddPointButton";
import { TimelineMenu } from "../molecule/TimelineMenu";
import { TripTimelinePoint } from "../molecule/TripTimelinePoint";

export function TripTimeline(props: {
  tripPoints: TripPointType[];
  trip: TripType;
  setTrip: Setter<TripType>;
  inDraw: boolean;
}) {
  let currentPassageTime = 0;
  let accumulateQuantity = 0;

  const [indexOfAddPoint, setIndexOfAddPoint] = createSignal<number>(-1);

  onMount(() => {
    //TODO
    // currentPassageTime = props.trip.startTime ?? 0;
    // set trip to display
    // setStopPointOnClick(() => onUpdateStop);

    setDisplayTrips([props.trip]);
    setStopPointOnClick(() => onUpdateStopFromMap);
    setSchoolPointOnClick(() => onUpdateStopFromMap);
  });

  createEffect(() => {
    setDisplayTrips([props.trip]);
  });

  onCleanup(() => {
    setDisplayTrips([]);
    setStopPointOnClick();
    setSchoolPointOnClick();
  });

  function onUpdateStopFromMap(stop: StopType | SchoolType): void {
    updateTripOnMapInteraction(stop, props.setTrip, indexOfAddPoint());
    updatePolylineWithOsrm(props.trip, props.setTrip);
    setIndexOfAddPoint(-1);
  }

  function updateWaitingTime(point: TripPointType, waitingTime: number) {
    props.setTrip((prev) => {
      const tripPoints = [...prev.tripPoints];
      for (const tripPoint of tripPoints) {
        if (tripPoint.leafletId == point.leafletId) {
          tripPoint.waitingTime = waitingTime;
        }
      }
      return { ...prev, tripPoints: tripPoints };
    });
  }

  function onClickAddFromTimeline(index: number) {
    setIndexOfAddPoint(index);
  }

  return (
    <div class="timeline">
      <div class="timeline-items ">
        <For each={props.tripPoints}>
          {(point, i) => {
            //TODO revoir ce code pour reactivity
            // eslint-disable-next-line solid/reactivity
            if (i() == 0) {
              currentPassageTime = 0;
              accumulateQuantity = 0;
            } else {
              // eslint-disable-next-line solid/reactivity
              currentPassageTime += props.tripPoints[i() - 1].waitingTime;
            }
            // eslint-disable-next-line solid/reactivity
            currentPassageTime += props.tripPoints[i()].passageTime;
            // eslint-disable-next-line solid/reactivity
            console.log(props.tripPoints[i()].waitingTime);

            const quantity = getSignedPointQuantity(point, props.trip);
            accumulateQuantity += calcAccumulateQuantity(quantity);

            return (
              <div class="timeline-block">
                <Show when={props.inDraw}>
                  <TripTimelineAddPointButton
                    onClickAdd={() => onClickAddFromTimeline(i())}
                  />
                </Show>

                <TripTimelinePoint
                  point={point}
                  tripColor={props.trip.color}
                  passageTime={currentPassageTime}
                  quantity={quantity}
                  accumulateQuantity={accumulateQuantity}
                >
                  <TimelineMenu
                    onClickDeletePoint={() => {
                      console.log("todo delete point from timeline");
                    }}
                    onClickWaitingTime={(waitingTime) =>
                      updateWaitingTime(point, waitingTime)
                    }
                    waitingTime={point.waitingTime}
                    // onClickDeletePoint={props.onClickRemovePointFromTrip}
                    // onClickWaitingTime={props.onClickWaitingTime}
                    // waitingTime={props.waitingTime}
                  />
                </TripTimelinePoint>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}

/**
 * Add or Delete Trip
 */

function updateTripOnMapInteraction(
  pointToOperate: StopType | SchoolType,
  setTrip: Setter<TripType>,
  index = -1
) {
  setTrip((prev) => {
    const tripPointIndex = prev.tripPoints.findIndex(
      (tripPoint) => tripPoint.leafletId == pointToOperate.leafletId
    );
    if (tripPointIndex != -1) {
      console.log("deletePoint", pointToOperate);
      prev.tripPoints.splice(tripPointIndex, 1);
    } else {
      console.log("addPoint", pointToOperate);
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
  });
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
      firstWaypointIndex,
      quantityToReplace,
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
async function updatePolylineWithOsrm(
  trip: TripType,
  setTrip: Setter<TripType>
) {
  enableSpinningWheel();
  console.log("updatePolylineWithOsrm : trip", trip);
  const {
    latlngs,
    projectedLatlngs,
    metrics,
    legsDurations,
    legsDistances,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stepsWeight,
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

  setTrip((prev) => {
    if (!prev) return prev;
    const trip = { ...prev };
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
        return {
          ...waypoint,
          onRoadLat: projectedLatlngs[i].lat,
          onRoadLon: projectedLatlngs[i].lng,
        };
      });
      trip.waypoints = waypoints;
    }

    return trip;
  });

  disableSpinningWheel();
}

/**
 * Quantity
 */

function calcAccumulateQuantity(pointQuantity: string): number {
  return parseInt(pointQuantity);
}

function getSignedPointQuantity(point: TripPointType, trip: TripType): string {
  return getQuantitySign(point, trip) + getPointQuantity(point, trip);
}
function getQuantitySign(point: TripPointType, trip: TripType) {
  if (
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.going &&
      point.nature == NatureEnum.stop) ||
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.coming &&
      point.nature == NatureEnum.school)
  ) {
    return "+";
  } else if (
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.going &&
      point.nature == NatureEnum.school) ||
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.coming &&
      point.nature == NatureEnum.stop)
  ) {
    return "-";
  }

  return "";
}

function getPointQuantity(point: TripPointType, trip: TripType) {
  if (point.nature == NatureEnum.school) {
    return getSchoolQuantity(point, trip);
  } else {
    return getStopQuantity(point);
  }
}

function getSchoolQuantity(point: TripPointType, trip: TripType) {
  let output = 0;
  //TODO à décommenter
  const school = SchoolStore.get(point.id) as SchoolType;
  const schoolGradesId: number[] = school.grades.map(
    (grade) => grade.id as number
  );

  for (const tripPoint of trip.tripPoints) {
    for (const grade of tripPoint.grades) {
      if (schoolGradesId.includes(grade.gradeId)) {
        output += grade.quantity;
      }
    }
  }

  return output;
}

function getStopQuantity(point: TripPointType) {
  return point.grades
    .map((grade) => grade.quantity)
    .reduce((total, quantity) => total + quantity, 0);
}
