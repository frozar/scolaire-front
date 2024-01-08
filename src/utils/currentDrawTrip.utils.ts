import _ from "lodash";
import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { TripPointType, TripType } from "../_entities/trip.entity";
import { WaypointType } from "../_entities/waypoint.entity";
import { OsrmService } from "../_services/osrm.service";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { NatureEnum } from "../type";
import {
  currentDrawTrip,
  currentTripIndex,
  displayTripMode,
  displayTripModeEnum,
  setCurrentDrawTrip,
  setCurrentTripIndex,
} from "../views/content/board/component/organism/DrawTripBoard";

export namespace CurrentDrawTripUtils {
  // TODO MAYBE_ERROR
  function setWaypoints(projectedLatlngs: L.LatLng[]) {
    if (!currentDrawTrip().waypoints) {
      return;
    }
    let waypoints = currentDrawTrip().waypoints as WaypointType[];
    waypoints = waypoints.map((waypoint, i) => {
      return {
        ...waypoint,
        onRoadLat: projectedLatlngs[i].lat,
        onRoadLon: projectedLatlngs[i].lng,
      };
    });

    setCurrentDrawTrip((trip) => {
      return { ...trip, waypoints: waypoints };
    });
  }

  function setWaypointsFromPoints(points: TripPointType[]) {
    const waypoints: WaypointType[] = [];
    for (const point of points) {
      if (point.nature == NatureEnum.school) {
        waypoints.push({
          idSchool: point.id,
          lon: point.lon,
          lat: point.lat,
        });
      } else if (point.nature == NatureEnum.stop) {
        waypoints.push({
          idStop: point.id,
          lon: point.lon,
          lat: point.lat,
        });
      }
    }
    setCurrentDrawTrip((trip) => {
      return { ...trip, waypoints: waypoints };
    });
  }

  export function addSchoolToTrip(school: SchoolType) {
    setCurrentDrawTrip((trip) => {
      return { ...trip, schools: [school] };
    });
  }

  // TODO review this nothing is done with school
  export function removeSchoolToTrip(school: SchoolType) {
    setCurrentDrawTrip((trip) => {
      return { ...trip, schools: [] };
    });
    console.log(school);
  }

  export function addPointToTrip(point: TripPointType) {
    setCurrentDrawTrip((trip: TripType) => {
      // TODO richard pourquoi cette condition ?
      const points = trip.tripPoints;
      if (!_.isEqual(points.at(-1), point)) {
        points.splice(currentTripIndex(), 0, point);
      }
      setCurrentTripIndex(points.length);
      return { ...trip, points };
    });
  }

  export function removePoint(point: StopType | SchoolType) {
    setCurrentDrawTrip((trip) => {
      return {
        ...trip,
        points: trip.tripPoints.filter(
          (p) => p.id != point.id && p.lat != point.lat && p.lon != point.lon
        ),
      };
    });
  }

  export function updatePoints(points: TripPointType[]) {
    setCurrentDrawTrip((trip) => {
      return { ...trip, points: points };
    });
    setWaypointsFromPoints(points);
    updatePolylineWithOsrm(currentDrawTrip());
  }

  export function removeTripPoint(
    tripPointId: number,
    tripPointNature: NatureEnum
  ) {
    setCurrentDrawTrip((prev) => {
      const updatedTripPoint: TripPointType[] = [];

      prev.tripPoints.forEach((tripPoint) => {
        if (
          !(tripPoint.id == tripPointId && tripPoint.nature == tripPointNature)
        ) {
          updatedTripPoint.push(tripPoint);
        }
      });
      return { ...prev, tripPoints: updatedTripPoint };
    });
  }

  export function updateWaypoints(waypoints: WaypointType[]) {
    setCurrentDrawTrip((trip) => {
      return { ...trip, waypoints: waypoints };
    });
    if (displayTripMode() == displayTripModeEnum.onRoad) {
      updatePolylineWithOsrm(currentDrawTrip());
    }
  }

  export async function updatePolylineWithOsrm(trip: TripType) {
    enableSpinningWheel();
    const { latlngs, projectedLatlngs, metrics, legsDurations, legsDistances } =
      await OsrmService.getRoadPolyline(trip);

    let someDuration = 0;
    const newLegsDuration: number[] = [];

    function isWaypoint(item: WaypointType | undefined): boolean {
      return item ? !item.idSchool && !item.idStop : false;
    }

    let cumulativeDistance = 0;
    const newLegsDistance: number[] = [0]; // 0 is the first value

    const size = trip.waypoints?.length as number;

    for (let i = 0; i < size - 1; i++) {
      if (!isWaypoint((trip.waypoints as WaypointType[])[i])) {
        cumulativeDistance += legsDistances[i];
        newLegsDistance.push(cumulativeDistance);
      } else cumulativeDistance += legsDistances[i];
    }

    console.log("newLegsDistance", newLegsDistance);

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

    setCurrentDrawTrip((prev) => {
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
      console.log("trip", trip);
      return trip;
    });
    setWaypoints(projectedLatlngs);
    disableSpinningWheel();
  }
}
