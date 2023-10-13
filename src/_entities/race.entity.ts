import L from "leaflet";
import { NatureEnum } from "../type";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_GREEN_BASE } from "../views/content/map/constant";
import { EntityUtils, LocationPathDBType, PointType } from "./_utils.entity";
import { SchoolType } from "./school.entity";
import {
  WaypointDBType,
  WaypointEntity,
  WaypointType,
} from "./waypoint.entity";

export namespace RaceEntity {
  export function build(dbData: RaceDBType): RaceType {
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
      points: formatRacePointType(dbData.bus_line_stop),
      waypoints: WaypointEntity.formatWaypointType(dbData.waypoint),
      latLngs: dbData.polyline
        ? dbData.polyline.data.map((item) => L.latLng(item.lat, item.lng))
        : [],
      selected: false,
      metrics: dbData.metrics,
    };
  }

  export function defaultRace(): RaceType {
    return {
      schools: [],
      name: "My Default Name",
      color: COLOR_GREEN_BASE,
      points: [],
      waypoints: [],
      latLngs: [],
      selected: false,
      metrics: {},
    };
  }

  export function dbFormat(line: RaceType): Partial<RaceDBType> {
    const name = line.name ? line.name : "";
    return {
      color: EntityUtils.formatColorForDB(line.color),
      name: name,
      school_id: line.schools[0].id,
      bus_line_stop: formatRacePointDBType(line.points),
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
    line: Partial<RaceType>
  ): Partial<RaceDBType> {
    let output = {};

    if (line.color) {
      output = { ...output, color: EntityUtils.formatColorForDB(line.color) };
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
    if (line.points) {
      output = {
        ...output,
        bus_line_stop: formatRacePointDBType(line.points),
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
}

export type RaceType = {
  id?: number;
  schools: SchoolType[];
  name: string;
  color: string;
  points: RacePointType[];
  waypoints?: WaypointType[];
  latLngs: L.LatLng[];
  selected: boolean;
  metrics?: RaceMetricType;
};

export type RacePointType = {
  id: number;
  leafletId: number;
  name: string;
  lon: number;
  lat: number;
  quantity: number;
  nature: NatureEnum;
};

export type RaceDBType = {
  id: number;
  school_id: number;
  name: string;
  color: string;
  bus_line_stop: RacePointDBType[];
  polyline: LocationPathDBType;
  metrics: RaceMetricType;
  waypoint: WaypointDBType[];
};

export type RacePointDBType = {
  stop_id: number;
  school_id: number;
  quantity: number;
};

export type RaceMetricType = {
  distance?: number;
  duration?: number;
  distancePCC?: number;
  deviation?: number;
  kmPassager?: number;
  txRemplissMoy?: number;
  CO2?: number;
};

function formatRacePointDBType(points: RacePointType[]): RacePointDBType[] {
  return points.map((point) => {
    return {
      stop_id: point.nature == NatureEnum.stop ? point.id : 0,
      school_id: point.nature == NatureEnum.school ? point.id : 0,
      quantity: point.quantity,
    };
  });
}

/**
 * Format the bus line associated points
 * @param points
 * @returns
 */
function formatRacePointType(points: RacePointDBType[]): RacePointType[] {
  //TODO Investigate the problem during switching between map [old comment to investigate]
  return points
    .map((dbPoint) => {
      const associatedPoint: PointType = getAssociatedRacePoint(dbPoint);
      if (associatedPoint) {
        return {
          id: associatedPoint.id,
          leafletId: associatedPoint.leafletId,
          name: associatedPoint.name,
          lon: associatedPoint.lon,
          lat: associatedPoint.lat,
          nature: associatedPoint.nature,
          quantity: dbPoint.quantity,
        };
      } else {
        //TODO Error log to improve
        console.log(
          "Error : impossible de retrouver le point de la ligne de bus "
        );
      }
    })
    .filter((elem) => elem != undefined) as RacePointType[]; // temporary FIX Filter to delete undefined data
}

function getAssociatedRacePoint(dbPoint: RacePointDBType): PointType {
  if (dbPoint.school_id != 0) {
    return getSchools().filter((item) => item.id == dbPoint.school_id)[0];
  }
  return getStops().filter((item) => item.id == dbPoint.stop_id)[0];
}
