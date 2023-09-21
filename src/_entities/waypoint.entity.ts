import { NatureEnum } from "../type";
import { BusLineType, WaypointType } from "./bus-line.entity";

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
}
