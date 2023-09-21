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
    console.log("oldWaypoint", newWaypoints);
    // console.log("index + 2", index + 2);
    // console.log("points.length", points.length);
    console.log("index", index);
    console.log("points.length - 1", points.length - 1);

    // if (points.length < index + 2) {
    //   newWaypoints.push({
    //     idStop: point.id,
    //     lat: point.lat,
    //     lon: point.lon,
    //   });
    //   return newWaypoints;
    // }
    if (points.length - 1 == index) {
      console.log("ajouté à la fin");

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

    console.log("indexNextWaypoint", indexNextWaypoint);
    console.log("indexPreviousWaypoint", indexPreviousWaypoint);
    console.log("toDelete", toDelete);
    newWaypoints.splice(indexPreviousWaypoint + 1, toDelete, {
      idStop: point.id,
      lat: point.lat,
      lon: point.lon,
    });
    return newWaypoints;
  }
}
