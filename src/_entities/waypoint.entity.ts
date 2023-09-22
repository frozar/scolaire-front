import { NatureEnum } from "../type";
import { BusLinePointType, BusLineType, WaypointType } from "./bus-line.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";

export namespace WaypointEntity {
  export function createWaypointsFromPoints(busLine: BusLineType) {
    const waypoints: WaypointType[] = [];

    for (const point of busLine.points) {
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
    return waypoints;
  }

  export function updateWaypoints(
    point: StopType | SchoolType,
    waypoints: WaypointType[],
    points: BusLinePointType[]
  ) {
    const newWaypoints = [...waypoints];

    const index = points.findIndex((actualPoint) => actualPoint.id == point.id);
    if (points.length - 1 == index) {
      newWaypoints.push({
        idStop: point.id,
        lat: point.lat,
        lon: point.lon,
      });
      return newWaypoints;
    }

    const indexPreviousWaypoint =
      index > 0
        ? waypoints.findIndex(
            (actualPoint) => actualPoint.idStop == points[index - 1].id
          )
        : -1;

    const indexNextWaypoint = waypoints.findIndex(
      (actualPoint) =>
        actualPoint.idStop == points[index + 1].id ||
        actualPoint.idSchool == points[index + 1].id
    );

    const difference = indexNextWaypoint - indexPreviousWaypoint;

    const toDelete = difference > 1 ? difference - 1 : 0;

    newWaypoints.splice(indexPreviousWaypoint + 1, toDelete, {
      idStop: point.id,
      lat: point.lat,
      lon: point.lon,
    });
    return newWaypoints;
  }

  export function deleteSchoolOrStopWaypoint(
    waypoints: WaypointType[],
    pointId: number,
    pointNature: NatureEnum
  ) {
    // TODO: Fix case deletion of the last point of the line
    // TODO: Fix case deletion and only one point left
    const waypointIndex = waypoints.findIndex((waypoint) =>
      pointNature == NatureEnum.stop
        ? waypoint.idStop == pointId
        : waypoint.idSchool == pointId
    );
    // console.log("pointId", pointId);
    // console.log("pointNature", pointNature);
    // console.log("waypointIndex", waypointIndex);
    // const newWaypoints = deleteWaypoint(waypoints, waypointIndex);
    // console.log("newWaypoints", newWaypoints);

    return deleteWaypoint(waypoints, waypointIndex);
    // return newWaypoints;
  }

  export function createWaypoint(
    waypoints: WaypointType[],
    index: number,
    lat: number,
    lon: number
  ): WaypointType[] {
    const newWaypoint: WaypointType = {
      lat,
      lon,
    };
    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 0, newWaypoint);

    return newWaypoints;
  }

  export function deleteWaypoint(waypoints: WaypointType[], index: number) {
    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 1);

    return newWaypoints;
  }
}
