import L from "leaflet";
import { Accessor, Setter, createSignal } from "solid-js";
import { useStateAction } from "../StateAction";
import { OsrmService } from "../_services/osrm.service";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { NatureEnum } from "../type";
import { PointType } from "../views/content/map/component/atom/Point";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../views/content/map/constant";
import { EntityUtils, LocationPathDBType } from "./_utils.entity";
import { SchoolType } from "./school.entity";

const [, { getLineUnderConstruction, setLineUnderConstruction }] =
  useStateAction();

export class BusLineEntity {
  static build(dbData: BusLineDBType): BusLineType {
    const filteredShools: PointType[] = getSchools().filter(
      (item) => item.id == dbData.school_id
    );

    if (filteredShools.length == 0) {
      //TODO Error log to improve
      console.log(
        "Error : impossible de retrouver l'établissement avec l'id " +
          dbData.school_id
      );
    }

    const school = filteredShools[0];

    const [selected, setSelected] = createSignal<boolean>(false);
    const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
    const [color, setColor] = createSignal<string>("#" + dbData.color);
    const [metrics, setMetrics] = createSignal<busLineMetricType>({});

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
      points: formatBusLinePointType(dbData.bus_line_stop),
      latLngs: latLngs,
      setLatLngs: setLatLngs,
      selected: selected,
      setSelected: setSelected,
      metrics: metrics,
      setMetrics: setMetrics,
    };
  }

  static defaultBusLine(): BusLineType {
    const [latLngs, setLatLngs] = createSignal<L.LatLng[]>([]);
    const [color, setColor] = createSignal<string>(
      COLOR_LINE_UNDER_CONSTRUCTION
    );
    const [selected, setSelected] = createSignal<boolean>(false);
    const [metrics, setMetrics] = createSignal<busLineMetricType>({});

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

  static dbFormat(line: BusLineType): Omit<BusLineDBType, "id"> {
    const name = line.name ? line.name : "";
    return {
      color: formatColorForDB(line.color()),
      name: name,
      school_id: line.schools[0].id,
      bus_line_stop: formatBusLinePointDBType(line.points),
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
    };
  }

  static dbPartialFormat(line: Partial<BusLineType>): Partial<BusLineDBType> {
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
        bus_line_stop: formatBusLinePointDBType(line.points),
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
const formatBusLinePointType = (
  points: BusLinePointDBType[]
): BusLinePointType[] => {
  //TODO Investigate the problem during switching between map
  return points
    .map((dbPoint) => {
      const associatedPoint: PointType = getAssociatedBusLinePoint(dbPoint);
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
    .filter((elem) => elem != undefined) as BusLinePointType[]; // temporary FIX Filter to delete undefined data
};

const formatBusLinePointDBType = (
  points: BusLinePointType[]
): BusLinePointDBType[] => {
  return points.map((point) => {
    return {
      stop_id: point.nature == NatureEnum.stop ? point.id : 0,
      school_id: point.nature == NatureEnum.school ? point.id : 0,
      quantity: point.quantity,
    };
  });
};

const getAssociatedBusLinePoint = (dbPoint: BusLinePointDBType): PointType => {
  if (dbPoint.school_id != 0) {
    return getSchools().filter((item) => item.id == dbPoint.school_id)[0];
  }
  return getStops().filter((item) => item.id == dbPoint.stop_id)[0];
};

export async function updatePolylineWithOsrm(busLine: BusLineType) {
  enableSpinningWheel();
  const { latlngs, metrics } = await OsrmService.getRoadPolyline(busLine);

  busLine.setLatLngs(latlngs[0]);
  busLine.setMetrics(metrics);
  setOnRoad(busLine, latlngs);
  disableSpinningWheel();
}

//TODO Tester sans ce nouveau type => tester ajout d'une nouvelle nature waypoint
export type WaypointType = {
  idSchool?: number;
  idStop?: number;
  lat: number;
  lon: number;
  onRoadLat?: number;
  onRoadLon?: number;
};

export type BusLineType = {
  id?: number;
  schools: SchoolType[];
  name?: string;
  color: Accessor<string>;
  setColor: Setter<string>;
  points: BusLinePointType[];
  waypoints?: WaypointType[];
  latLngs: Accessor<L.LatLng[]>;
  setLatLngs: Setter<L.LatLng[]>;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  metrics: Accessor<busLineMetricType>;
  setMetrics: Setter<busLineMetricType>;
};

export type BusLinePointType = {
  id: number;
  leafletId: number;
  name: string;
  lon: number;
  lat: number;
  onRoadLon?: number;
  onRoadLat?: number;
  quantity: number;
  nature: NatureEnum;
};

export type BusLineDBType = {
  id: number;
  school_id: number;
  name: string;
  color: string;
  bus_line_stop: BusLinePointDBType[];
  polyline: LocationPathDBType;
  metrics: busLineMetricType;
};

export type BusLinePointDBType = {
  stop_id: number;
  school_id: number;
  quantity: number;
};

export type busLineMetricType = {
  distance?: number;
  duration?: number;
  distancePCC?: number;
  deviation?: number;
  kmPassager?: number;
  txRemplissMoy?: number;
  CO2?: number;
};

//Todo delete function : ne pas utiliser le signal
// ! Do the same but with waypoints
// function setOnRoad(latlngs: [L.LatLng[], L.LatLng[]]) {
//   const pointsWithOnRoad: BusLinePointType[] =
//     getLineUnderConstruction().busLine.points.map((point, i) => {
//       return {
//         ...point,
//         onRoadLon: latlngs[1][i].lng,
//         onRoadLat: latlngs[1][i].lat,
//       };
//     });

//   setLineUnderConstruction({
//     ...getLineUnderConstruction(),
//     busLine: {
//       ...getLineUnderConstruction().busLine,
//       points: pointsWithOnRoad,
//     },
//   });
// }

function setOnRoad(busLine: BusLineType, latlngs: [L.LatLng[], L.LatLng[]]) {
  let waypoints = busLine.waypoints;
  if (!waypoints) {
    return;
  }
  waypoints = [...waypoints].map((waypoint, i) => {
    return {
      ...waypoint,
      onRoadLat: latlngs[1][i].lat,
      onRoadLon: latlngs[1][i].lng,
    };
  });

  // const pointsWithOnRoad: BusLinePointType[] =
  //   getLineUnderConstruction().busLine.points.map((point, i) => {
  //     return {
  //       ...point,
  //       onRoadLon: latlngs[1][i].lng,
  //       onRoadLat: latlngs[1][i].lat,
  //     };
  //   });

  setLineUnderConstruction({
    ...getLineUnderConstruction(),
    busLine: {
      ...getLineUnderConstruction().busLine,
      waypoints,
    },
  });
  console.log("waypoints", waypoints);
}
