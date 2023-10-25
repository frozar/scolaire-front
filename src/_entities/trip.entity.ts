import L from "leaflet";
import { NatureEnum } from "../type";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_GREEN_BASE } from "../views/content/map/constant";
import { EntityUtils, LocationPathDBType, PointType } from "./_utils.entity";
import { GradeTripDBType, GradeTripType } from "./grade.entity";
import { SchoolType } from "./school.entity";
import {
  WaypointDBType,
  WaypointEntity,
  WaypointType,
} from "./waypoint.entity";

export namespace TripEntity {
  export function build(dbData: TripDBType): TripType {
    const filteredShools: SchoolType[] = getSchools().filter(
      (item) => item.id == dbData.school_id
    );

    if (filteredShools.length == 0) {
      //TODO Error log to improve
      console.log(
        "Error : impossible de retrouver l'établissement avec l'id " +
          dbData.school_id
      );
    }

    const school: SchoolType = filteredShools[0];

    return {
      id: dbData.id,
      schools: [school],
      name: dbData.name,
      color: "#" + dbData.color,
      tripPoints: formatTripPointType(dbData.trip_stop),
      waypoints: WaypointEntity.formatWaypointType(dbData.waypoint),
      latLngs: dbData.polyline
        ? dbData.polyline.data.map((item) => L.latLng(item.lat, item.lng))
        : [],
      selected: false,
      metrics: dbData.metrics,
    };
  }

  export function defaultTrip(): TripType {
    return {
      schools: [],
      name: "My Default Name",
      color: COLOR_GREEN_BASE,
      tripPoints: [],
      waypoints: [],
      latLngs: [],
      selected: false,
      metrics: {},
    };
  }

  export function dbFormat(line: TripType): Partial<TripDBType> {
    const name = line.name ? line.name : "";
    return {
      color: EntityUtils.formatColorForDB(line.color),
      name: name,
      school_id: line.schools[0].id,
      trip_stop: formatTripPointDBType(line.tripPoints),
      polyline: EntityUtils.buildLocationPath(line.latLngs),
      metrics: {
        distance: line.metrics?.distance,
        duration: line.metrics?.duration,
        distancePCC: line.metrics?.distancePCC,
        deviation: line.metrics?.deviation,
        kmPassager: line.metrics?.kmPassager,
        txRemplissMoy: line.metrics?.txRemplissMoy,
        CO2: line.metrics?.CO2,
      },
      waypoint: WaypointEntity.formatWaypointDBType(
        line.waypoints as WaypointType[]
      ),
    };
  }

  export function dbPartialFormat(
    line: Partial<TripType>
  ): Partial<TripDBType> {
    let output = {};

    if (line.color) {
      output = { ...output, color: EntityUtils.formatColorForDB(line.color) };
    }
    if (line.schools) {
      output = { ...output, school_id: line.schools[0].id };
    }
    if (line.latLngs) {
      output = {
        ...output,
        polyline: EntityUtils.buildLocationPath(line.latLngs),
      };
    }
    if (line.name) {
      output = {
        ...output,
        name: line.name,
      };
    }
    if (line.tripPoints) {
      output = {
        ...output,
        trip_stop: formatTripPointDBType(line.tripPoints),
      };
    }
    if (line.waypoints) {
      output = {
        ...output,
        waypoint: WaypointEntity.formatWaypointDBType(line.waypoints),
      };
    }
    if (line.metrics) {
      output = {
        ...output,
        metrics: line.metrics,
      };
    }

    return output;
  }

  export function getStopTrips(stopId: number) {
    const trips: TripType[] = [];

    for (const line of getLines()) {
      line.trips.map((trip) => {
        trip.tripPoints.map((point) => {
          if (point.nature == NatureEnum.stop && point.id == stopId)
            trips.push(trip);
        });
      });
    }
    return trips;
  }
}

export type TripType = {
  id?: number;
  schools: SchoolType[];
  name: string;
  color: string;
  tripPoints: TripPointType[];
  waypoints?: WaypointType[];
  latLngs: L.LatLng[];
  selected: boolean;
  metrics?: TripMetricType;
};

export type TripPointType = {
  id: number;
  leafletId: number;
  name: string;
  lon: number;
  lat: number;
  quantity: number; // TODO: Delete when unsed
  nature: NatureEnum;
  grades: GradeTripType[];
};

export type TripDBType = {
  id: number;
  school_id: number;
  name: string;
  color: string;
  trip_stop: TripPointDBType[];
  polyline: LocationPathDBType;
  metrics: TripMetricType;
  waypoint: WaypointDBType[];
};

export type TripPointDBType = {
  stop_id: number;
  school_id: number;
  quantity: number; // TODO: Delete when unsed
  grades: GradeTripDBType[];
};

export type TripMetricType = {
  distance?: number;
  duration?: number;
  distancePCC?: number;
  deviation?: number;
  kmPassager?: number;
  txRemplissMoy?: number;
  CO2?: number;
};

function formatTripPointDBType(points: TripPointType[]): TripPointDBType[] {
  return points.map((point) => {
    return {
      stop_id: point.nature == NatureEnum.stop ? point.id : 0,
      school_id: point.nature == NatureEnum.school ? point.id : 0,
      quantity: point.quantity,
      grades: point.grades.map((grade) => {
        return { grade_id: grade.gradeId, quantity: grade.quantity };
      }),
    };
  });
}

/**
 * Format the bus line associated points
 * @param points
 * @returns
 */
function formatTripPointType(points: TripPointDBType[]): TripPointType[] {
  //TODO Investigate the problem during switching between map [old comment to investigate]
  return points
    .map((dbPoint) => {
      const associatedPoint: PointType = getAssociatedTripPoint(dbPoint);
      if (associatedPoint) {
        return {
          id: associatedPoint.id,
          leafletId: associatedPoint.leafletId,
          name: associatedPoint.name,
          lon: associatedPoint.lon,
          lat: associatedPoint.lat,
          nature: associatedPoint.nature,
          quantity: dbPoint.quantity,
          grades: dbPoint.grades.map((grade) => {
            return { gradeId: grade.grade_id, quantity: grade.quantity };
          }),
        };
      } else {
        //TODO Error log to improve
        console.log(
          "Error : impossible de retrouver le point de la ligne de bus "
        );
      }
    })
    .filter((elem) => elem != undefined) as TripPointType[]; // temporary FIX Filter to delete undefined data
}

function getAssociatedTripPoint(dbPoint: TripPointDBType): PointType {
  if (dbPoint.stop_id != 0) {
    return getStops().filter((item) => item.id == dbPoint.stop_id)[0];
  }
  return getSchools().filter((item) => item.id == dbPoint.school_id)[0];
}
