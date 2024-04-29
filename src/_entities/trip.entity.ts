import L from "leaflet";
import { getLines } from "../_stores/line.store";
import { SchoolStore, getSchools } from "../_stores/school.store";
import { getStops } from "../_stores/stop.store";
import { NatureEnum } from "../type";
import { QuantityUtils } from "../utils/quantity.utils";
import { StopUtils } from "../utils/stop.utils";
import { COLOR_GREEN_BASE } from "../views/content/map/constant";
import { EntityUtils, LocationPathDBType, PointType } from "./_utils.entity";
import { CalendarDayEnum } from "./calendar.entity";
import {
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
  export function build(dbData: TripDBType, lineId: number): TripType {
    const grades: GradeType[] = dbData.grades.map((gradeId) => {
      const grade: GradeType | undefined = SchoolStore.getGradeFromId(gradeId);
      if (grade) {
        return grade;
      }
    }) as GradeType[];
    const schools: SchoolType[] = SchoolStore.getAllOfGrades(grades);

    return {
      id: dbData.id,
      lineId: lineId,
      name: dbData.name,
      color: "#" + dbData.color,
      schools,
      grades,
      startTime: dbData.start_time
        ? GradeEntity.getHourFormatFromString(dbData.start_time)
        : undefined,
      days: dbData.days,
      tripDirectionId: dbData.trip_direction_id,
      busCategoriesId: dbData.bus_categories_id,
      allotmentId: dbData.allotment_id,
      tripPoints: buildTripPointType(
        dbData.trip_stop,
        dbData.days,
        TripDirectionEntity.FindDirectionById(dbData.trip_direction_id).type
      ),
      waypoints: WaypointEntity.formatWaypointType(dbData.waypoint),
      latLngs: dbData.polyline
        ? dbData.polyline.data.map((item) => L.latLng(item.lat, item.lng))
        : [],
      metrics: dbData.metrics,
      //TODO to delete
      selected: false,
    };
  }

  export function defaultTrip(lineId = -1): TripType {
    return {
      name: "My Default Name",
      lineId: lineId,
      color: COLOR_GREEN_BASE,
      tripPoints: [],
      waypoints: [],
      schools: [],
      grades: [],
      latLngs: [],
      selected: false,
      metrics: {},
      startTime: undefined,
      days: [],
      tripDirectionId: 0,
      busCategoriesId: 0,
      allotmentId: 0,
    };
  }

  export function dbFormat(trip: TripType) {
    const name = trip.name ? trip.name : "";
    return {
      color: EntityUtils.formatColorForDB(trip.color),
      name: name,
      trip_stop: formatTripPointDBType(trip.tripPoints),
      // trip_stop: [],
      polyline: EntityUtils.buildLocationPath(trip.latLngs),
      grades: trip.grades.map((item) => item.id) as number[],
      // grades: [],
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
      // waypoint: [],
      start_time: trip.startTime
        ? GradeEntity.getStringFromHourFormat(trip.startTime)
        : "",
      days: trip.days,
      // days: [],
      trip_direction_id: trip.tripDirectionId,
      bus_categories_id: trip.busCategoriesId,
      allotment_id: trip.allotmentId,
    };
  }

  export function dbPartialFormat(trip: TripType): Partial<TripDBType> {
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

export type TripDBType = {
  id: number;
  name: string;
  color: string;
  grades: number[]; //TODO Clarify using of grades type
  start_time: string;
  days: CalendarDayEnum[];
  trip_direction_id: number;
  bus_categories_id: number;
  allotment_id: number;
  trip_stop: TripPointDBType[];
  waypoint: WaypointDBType[];
  polyline: LocationPathDBType;
  metrics: TripMetricType;
};

export type TripType = {
  id?: number;
  lineId: number;
  name: string;
  color: string;
  grades: GradeType[];
  schools: SchoolType[];
  startTime?: HourFormat;
  days: CalendarDayEnum[];
  tripDirectionId: number;
  busCategoriesId?: number;
  allotmentId?: number;
  tripPoints: TripPointType[];
  waypoints?: WaypointType[];
  latLngs: L.LatLng[];
  metrics?: TripMetricType;
  //TODO to delete
  selected: boolean;
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
  waitingTime: number;
};

export type TripPointDBType = {
  stop_id: number;
  school_id: number;
  passage_time: number;
  start_to_trip_point_distance: number;
  waiting_time: number;
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
      grades: point.grades.map((grade) => {
        return { grade_id: grade.gradeId, quantity: grade.quantity };
      }),
      passage_time: point.passageTime,
      start_to_trip_point_distance: point.startToTripPointDistance,
      waiting_time: point.waitingTime,
    };
  });
}
/**
 * Format the bus line associated points
 * @param points
 * @returns
 */
function buildTripPointType(
  points: TripPointDBType[],
  days: CalendarDayEnum[],
  tripDirection: TripDirectionEnum
): TripPointType[] {
  //TODO revoir la fonction
  return points
    .map((dbPoint) => {
      const associatedPoint: PointType = getAssociatedTripPoint(dbPoint);
      const grades =
        associatedPoint.nature == NatureEnum.stop
          ? dbPoint.grades.map((grade) => {
              const stopGradeQuantity =
                StopUtils.get(dbPoint.stop_id)?.associated.filter(
                  (grade_) => grade_.gradeId == grade.grade_id
                )[0].quantity ?? [];
              return {
                gradeId: grade.grade_id,
                quantity: stopGradeQuantity,
                matrix: QuantityUtils.buildQuantityMatrix(
                  days,
                  stopGradeQuantity,
                  tripDirection
                ),
              };
            })
          : [];

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
          grades: grades,
          waitingTime: dbPoint.waiting_time,
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
    return getStops().find((item) => item.id == dbPoint.stop_id) as PointType;
  }
  return getSchools().find((item) => item.id == dbPoint.school_id) as PointType;
}
