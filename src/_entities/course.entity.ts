import L from "leaflet";
import { Accessor, Setter, createSignal } from "solid-js";
import { useStateAction } from "../StateAction";
import { OsrmService } from "../_services/osrm.service";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { NatureEnum } from "../type";
import { PointType } from "../views/content/map/component/atom/Point";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_DEFAULT_COURSE } from "../views/content/map/constant";
import {
  EntityUtils,
  LocationDBType,
  LocationDBTypeEnum,
  LocationPathDBType,
} from "./_utils.entity";
import { SchoolType } from "./school.entity";

const [, { getCourseUnderConstruction, setCourseUnderConstruction }] =
  useStateAction();

export class BusCourseEntity {
  static build(dbData: CourseDBType): CourseType {
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

    const [selected, setSelected] = createSignal<boolean>(false);
    const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
    const [color, setColor] = createSignal<string>("#" + dbData.color);
    const [metrics, setMetrics] = createSignal<CourseMetricType>({});

    if (dbData.polyline != null) {
      setLatLngs(
        dbData.polyline.data.map((item) => L.latLng(item.lat, item.lng))
      );
    }

    setMetrics(dbData.metrics);

    return {
      id: dbData.id,
      schools: [school],
      name: dbData.name,
      color: color,
      setColor: setColor,
      points: formatBusCoursePointType(dbData.bus_line_stop),
      waypoints: formatWaypointType(dbData.waypoint),
      latLngs: latLngs,
      setLatLngs: setLatLngs,
      selected: selected,
      setSelected: setSelected,
      metrics: metrics,
      setMetrics: setMetrics,
    };
  }

  static defaultBusCourse(): CourseType {
    const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
    const [color, setColor] = createSignal<string>(COLOR_DEFAULT_COURSE);
    const [selected, setSelected] = createSignal<boolean>(false);
    const [metrics, setMetrics] = createSignal<CourseMetricType>({});

    return {
      color: color,
      setColor: setColor,
      points: [],
      schools: [],
      name: "my default name",
      latLngs: latLngs,
      setLatLngs: setLatLngs,
      selected: selected,
      setSelected: setSelected,
      metrics: metrics,
      setMetrics: setMetrics,
    };
  }

  static dbFormat(line: CourseType): Omit<CourseDBType, "id"> {
    const name = line.name ? line.name : "";
    return {
      color: formatColorForDB(line.color()),
      name: name,
      school_id: line.schools[0].id,
      bus_line_stop: formatBusCoursePointDBType(line.points),
      polyline: EntityUtils.buildLocationPath(line.latLngs()),
      metrics: {
        distance: line.metrics().distance,
        duration: line.metrics().duration,
        distancePCC: line.metrics().distancePCC,
        deviation: line.metrics().deviation,
        kmPassager: line.metrics().kmPassager,
        txRemplissMoy: line.metrics().txRemplissMoy,
        CO2: line.metrics().CO2,
      },
      waypoint: formatWaypointDBType(line.waypoints as WaypointType[]),
    };
  }

  static dbPartialFormat(line: Partial<CourseType>): Partial<CourseDBType> {
    let output = {};

    if (line.color) {
      output = { ...output, color: formatColorForDB(line.color()) };
    }
    if (line.latLngs) {
      output = {
        ...output,
        polyline: EntityUtils.buildLocationPath(line.latLngs()),
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
        bus_line_stop: formatBusCoursePointDBType(line.points),
      };
    }
    if (line.waypoints) {
      output = {
        ...output,
        waypoint: formatWaypointDBType(line.waypoints),
      };
    }
    if (line.metrics) {
      output = {
        ...output,
        metrics: line.metrics(),
      };
    }

    return output;
  }
}

function formatColorForDB(color: string) {
  if (color.startsWith("#")) {
    return color.replace("#", "");
  }
  return color;
}

/**
 * Format the bus line associated points
 * @param points
 * @returns
 */
const formatBusCoursePointType = (
  points: CoursePointDBType[]
): CoursePointType[] => {
  //TODO Investigate the problem during switching between map
  return points
    .map((dbPoint) => {
      const associatedPoint: PointType = getAssociatedBusCoursePoint(dbPoint);
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
    .filter((elem) => elem != undefined) as CoursePointType[]; // temporary FIX Filter to delete undefined data
};

const formatWaypointType = (waypoints: WaypointDBType[]): WaypointType[] => {
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
};

const formatBusCoursePointDBType = (
  points: CoursePointType[]
): CoursePointDBType[] => {
  return points.map((point) => {
    return {
      stop_id: point.nature == NatureEnum.stop ? point.id : 0,
      school_id: point.nature == NatureEnum.school ? point.id : 0,
      quantity: point.quantity,
    };
  });
};

const formatWaypointDBType = (waypoints: WaypointType[]): WaypointDBType[] => {
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
};

const getAssociatedBusCoursePoint = (dbPoint: CoursePointDBType): PointType => {
  if (dbPoint.school_id != 0) {
    return getSchools().filter((item) => item.id == dbPoint.school_id)[0];
  }
  return getStops().filter((item) => item.id == dbPoint.stop_id)[0];
};

export async function updatePolylineWithOsrm(course: CourseType) {
  enableSpinningWheel();
  const { latlngs, projectedLatlngs, metrics } =
    await OsrmService.getRoadPolyline(course);

  course.setLatLngs(latlngs);
  course.setMetrics(metrics);
  setOnRoad(course, projectedLatlngs);
  disableSpinningWheel();
}

//TODO Tester sans ce nouveau type => tester ajout d'une nouvelle nature waypoint
//TODO !!! à placer dans WayPoint si c'est utile !!
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

export type CourseType = {
  id?: number;
  schools: SchoolType[];
  name?: string;
  color: Accessor<string>;
  setColor: Setter<string>;
  points: CoursePointType[];
  waypoints?: WaypointType[];
  latLngs: Accessor<L.LatLng[]>;
  setLatLngs: Setter<L.LatLng[]>;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  metrics: Accessor<CourseMetricType>;
  setMetrics: Setter<CourseMetricType>;
};

export type CoursePointType = {
  id: number;
  leafletId: number;
  name: string;
  lon: number;
  lat: number;
  quantity: number;
  nature: NatureEnum;
};

export type CourseDBType = {
  id: number;
  school_id: number;
  name: string;
  color: string;
  bus_line_stop: CoursePointDBType[];
  polyline: LocationPathDBType;
  metrics: CourseMetricType;
  waypoint: WaypointDBType[];
};

export type CoursePointDBType = {
  stop_id: number;
  school_id: number;
  quantity: number;
};

export type CourseMetricType = {
  distance?: number;
  duration?: number;
  distancePCC?: number;
  deviation?: number;
  kmPassager?: number;
  txRemplissMoy?: number;
  CO2?: number;
};

//Todo delete function : ne pas utiliser le signal
function setOnRoad(course: CourseType, projectedLatlngs: L.LatLng[]) {
  if (projectedLatlngs.length == 0) {
    setCourseUnderConstruction({
      ...getCourseUnderConstruction(),
      course: course,
    });
    return;
  }
  let waypoints = course.waypoints;
  if (!waypoints) {
    return;
  }
  waypoints = [...waypoints].map((waypoint, i) => {
    return {
      ...waypoint,
      onRoadLat: projectedLatlngs[i].lat,
      onRoadLon: projectedLatlngs[i].lng,
    };
  });

  setCourseUnderConstruction({
    ...getCourseUnderConstruction(),
    course: {
      ...getCourseUnderConstruction().course,
      waypoints,
    },
  });
}
