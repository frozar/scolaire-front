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
    const { latlngs, projectedLatlngs, metrics } =
      await OsrmService.getRoadPolyline(trip);

    setCurrentDrawTrip((trip) => {
      return { ...trip, latLngs: latlngs };
    });
    setCurrentDrawTrip((trip) => {
      return { ...trip, metrics: metrics };
    });

    setWaypoints(projectedLatlngs);
    disableSpinningWheel();
  }
}
