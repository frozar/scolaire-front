import { NatureEnum } from "../type";
import {
  BusCoursePointType,
  BusCourseType,
  WaypointType,
} from "./bus-course.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";

export namespace WaypointEntity {
  export function createWaypointsFromPoints(busCourse: BusCourseType) {
    const waypoints: WaypointType[] = [];

    for (const point of busCourse.points) {
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
    points: BusCoursePointType[]
  ) {
    const newWaypoints = [...waypoints];

    const index = points.findIndex((actualPoint) => actualPoint.id == point.id);
    if (points.length - 1 == index) {
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

    const indexPreviousWaypoint =
      index > 0
        ? waypoints.findIndex((actualPoint) =>
            points[index - 1].nature == NatureEnum.stop
              ? actualPoint.idStop == points[index - 1].id
              : actualPoint.idSchool == points[index - 1].id
          )
        : -1;

    const indexNextWaypoint = waypoints.findIndex((actualPoint) =>
      points[index + 1].nature == NatureEnum.stop
        ? actualPoint.idStop == points[index + 1].id
        : actualPoint.idSchool == points[index + 1].id
    );

    const difference = indexNextWaypoint - indexPreviousWaypoint;

    const toDelete = difference > 1 ? difference - 1 : 0;

    newWaypoints.splice(
      indexPreviousWaypoint + 1,
      toDelete,
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
    return newWaypoints;
  }

  export function deleteSchoolOrStopWaypoint(
    waypoints: WaypointType[],
    pointId: number,
    pointNature: NatureEnum
  ) {
    const waypointIndex = waypoints.findIndex((waypoint) =>
      pointNature == NatureEnum.stop
        ? waypoint.idStop == pointId
        : waypoint.idSchool == pointId
    );

    return deleteWaypoint(waypoints, waypointIndex);
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
