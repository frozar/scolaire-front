import L from "leaflet";
import { NatureEnum } from "../type";
import { QuantityUtils } from "../utils/quantity.utils";
import { StopUtils } from "../utils/stop.utils";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_GREEN_BASE } from "../views/content/map/constant";
import { EntityUtils, LocationPathDBType, PointType } from "./_utils.entity";
import { CalendarDayEnum } from "./calendar.entity";
import {
  GradeDBType,
  GradeEntity,
  GradeTripDBType,
  GradeTripType,
  GradeType,
  HourFormat,
} from "./grade.entity";
import { SchoolType } from "./school.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "./trip-direction.entity";
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
    console.log(
      "before build:",
      dbData.trip_stop,
      dbData.days,
      TripDirectionEntity.FindDirectionById(dbData.trip_direction_id).type
    );

    return {
      id: dbData.id,
      schools: [school],
      name: dbData.name,
      color: "#" + dbData.color,
      grades:
        dbData.grades != undefined
          ? dbData.grades.map((grade) =>
              GradeEntity.build(grade as GradeDBType)
            )
          : [],
      tripPoints: formatTripPointType(
        dbData.trip_stop,
        dbData.days,
        TripDirectionEntity.FindDirectionById(dbData.trip_direction_id).type
      ),
      waypoints: WaypointEntity.formatWaypointType(dbData.waypoint),
      latLngs: dbData.polyline
        ? dbData.polyline.data.map((item) => L.latLng(item.lat, item.lng))
        : [],
      selected: false,
      metrics: dbData.metrics,
      startTime: dbData.start_time
        ? GradeEntity.getHourFormatFromString(dbData.start_time)
        : undefined,
      days: dbData.days,
      tripDirectionId: dbData.trip_direction_id,
    };
  }

  export function defaultTrip(): TripType {
    return {
      schools: [],
      name: "My Default Name",
      color: COLOR_GREEN_BASE,
      tripPoints: [],
      waypoints: [],
      grades: [],
      latLngs: [],
      selected: false,
      metrics: {},
      startTime: undefined,
      days: [],
      tripDirectionId: 0,
    };
  }

  export function dbFormat(trip: TripType): Partial<TripDBType> {
    const name = trip.name ? trip.name : "";
    return {
      color: EntityUtils.formatColorForDB(trip.color),
      name: name,
      school_id: trip.schools[0].id,
      trip_stop: formatTripPointDBType(trip.tripPoints),
      polyline: EntityUtils.buildLocationPath(trip.latLngs),
      grades: trip.grades.map((item) => item.id) as number[],
      metrics: {
        distance: trip.metrics?.distance,
        duration: trip.metrics?.duration,
        distancePCC: trip.metrics?.distancePCC,
        deviation: trip.metrics?.deviation,
        kmPassager: trip.metrics?.kmPassager,
        txRemplissMoy: trip.metrics?.txRemplissMoy,
        CO2: trip.metrics?.CO2,
      },
      waypoint: WaypointEntity.formatWaypointDBType(
        trip.waypoints as WaypointType[]
      ),
      start_time: trip.startTime
        ? GradeEntity.getStringFromHourFormat(trip.startTime)
        : undefined,
      days: trip.days,
      trip_direction_id: trip.tripDirectionId,
    };
  }

  export function dbPartialFormat(
    trip: Partial<TripType>
  ): Partial<TripDBType> {
    let output = {};

    if (trip.startTime) {
      output = {
        ...output,
        start_time: GradeEntity.getStringFromHourFormat(trip.startTime),
      };
    }
    if (trip.color) {
      output = { ...output, color: EntityUtils.formatColorForDB(trip.color) };
    }
    if (trip.schools) {
      output = { ...output, school_id: trip.schools[0].id };
    }
    if (trip.latLngs) {
      output = {
        ...output,
        polyline: EntityUtils.buildLocationPath(trip.latLngs),
      };
    }
    if (trip.name) {
      output = {
        ...output,
        name: trip.name,
      };
    }
    if (trip.tripPoints) {
      output = {
        ...output,
        trip_stop: formatTripPointDBType(trip.tripPoints),
      };
    }
    if (trip.waypoints) {
      output = {
        ...output,
        waypoint: WaypointEntity.formatWaypointDBType(trip.waypoints),
      };
    }
    if (trip.metrics) {
      output = {
        ...output,
        metrics: trip.metrics,
      };
    }
    if (trip.grades) {
      output = {
        ...output,
        grades: trip.grades.map((item) => item.id),
      };
    }
    if (trip.days)
      output = {
        ...output,
        days: trip.days,
      };
    if (trip.tripDirectionId) {
      output = {
        ...output,
        trip_direction_id: trip.tripDirectionId,
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
  grades: GradeType[];
  tripPoints: TripPointType[];
  waypoints?: WaypointType[];
  latLngs: L.LatLng[];
  selected: boolean;
  metrics?: TripMetricType;
  startTime?: HourFormat;
  tripDirectionId: number;
  days: CalendarDayEnum[];
};

export type TripPointType = {
  id: number;
  leafletId: number;
  name: string;
  lon: number;
  lat: number;
  nature: NatureEnum;
  grades: GradeTripType[];
  // TODO: Rename to timeToReach
  passageTime: number;
  startToTripPointDistance: number;
};

export type TripDBType = {
  id: number;
  school_id: number;
  name: string;
  color: string;
  grades: (number | GradeDBType)[]; //TODO Clarify using of grades type
  trip_stop: TripPointDBType[];
  polyline: LocationPathDBType;
  metrics: TripMetricType;
  waypoint: WaypointDBType[];
  start_time: string;
  trip_direction_id: number;
  days: CalendarDayEnum[];
};

export type TripPointDBType = {
  stop_id: number;
  school_id: number;
  grades: GradeTripDBType[];
  passage_time: number;
  start_to_trip_point_distance: number;
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
      grades: point.grades.map((grade) => {
        return { grade_id: grade.gradeId, quantity: grade.quantity };
      }),
      passage_time: point.passageTime,
      start_to_trip_point_distance: point.startToTripPointDistance,
    };
  });
}

/**
 * Format the bus line associated points
 * @param points
 * @returns
 */
function formatTripPointType(
  points: TripPointDBType[],
  days: CalendarDayEnum[],
  tripDirection: TripDirectionEnum
): TripPointType[] {
  //TODO Investigate the problem during switching between map [old comment to investigate]

  console.log("POINTS:", points);

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
          passageTime: dbPoint.passage_time,
          startToTripPointDistance: dbPoint.start_to_trip_point_distance,
          grades: dbPoint.grades.map((grade) => {
            const stopGradeQuantity = StopUtils.get(
              dbPoint.stop_id
              // ! HERE IS THE PROBLEM
            ).associated.filter((grade_) => grade_.gradeId == grade.grade_id)[0]
              .quantity;
            return {
              gradeId: grade.grade_id,
              quantity: stopGradeQuantity,
              matrix: QuantityUtils.buildQuantityMatrix(
                days,
                stopGradeQuantity,
                tripDirection
              ),
            };
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
