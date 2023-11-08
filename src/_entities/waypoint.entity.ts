import { NatureEnum } from "../type";
import { LocationDBType, LocationDBTypeEnum } from "./_utils.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";
import { TripPointType, TripType } from "./trip.entity";

export namespace WaypointEntity {
  // TODO unused ?
  export function createWaypointsFromTrip(trip: TripType) {
    const waypoints: WaypointType[] = [];

    for (const point of trip.tripPoints) {
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

  export function formatWaypointType(
    waypoints: WaypointDBType[]
  ): WaypointType[] {
    return waypoints.map((waypoint) => {
      return {
        idSchool: waypoint.school_id ? waypoint.school_id : undefined,
        idStop: waypoint.stop_id ? waypoint.stop_id : undefined,
        lat: waypoint.location.data.lat,
        lon: waypoint.location.data.lng,
        onRoadLat: waypoint.on_road_location.data.lat,
        onRoadLon: waypoint.on_road_location.data.lng,
      };
    });
  }

  export function formatWaypointDBType(
    waypoints: WaypointType[]
  ): WaypointDBType[] {
    return waypoints.map((waypoint) => {
      return {
        stop_id: waypoint.idStop ? waypoint.idStop : undefined,
        school_id: waypoint.idSchool ? waypoint.idSchool : undefined,
        location: {
          type: LocationDBTypeEnum.point,
          data: {
            lng: waypoint.lon,
            lat: waypoint.lat,
          },
        },
        on_road_location: {
          type: LocationDBTypeEnum.point,
          data: {
            lng: waypoint.onRoadLon as number,
            lat: waypoint.onRoadLat as number,
          },
        },
      };
    });
  }

  // TODO revoir si doit être placé ici
  export function updateWaypoints(
    point: StopType | SchoolType,
    waypoints: WaypointType[],
    points: TripPointType[]
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
export type WaypointType = {
  idSchool?: number;
  idStop?: number;
  lat: number;
  lon: number;
  onRoadLat?: number;
  onRoadLon?: number;
};

export type WaypointDBType = {
  stop_id?: number;
  school_id?: number;
  location: LocationDBType;
  on_road_location: LocationDBType;
};
