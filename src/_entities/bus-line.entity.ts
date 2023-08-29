import L from "leaflet";
import { Accessor, Setter, createSignal } from "solid-js";
import { OsrmService } from "../_services/osrm.service";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";
import { NatureEnum } from "../type";
import { PointType } from "../views/content/graphicage/component/atom/Point";
import { getSchools } from "../views/content/graphicage/component/organism/SchoolPoints";
import { getStops } from "../views/content/graphicage/component/organism/StopPoints";
import { EntityUtils, LocationPathDBType } from "./_utils.entity";
import { SchoolType } from "./school.entity";

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

    if (dbData.polyline != null) {
      setLatLngs(
        dbData.polyline.data.map((item) => L.latLng(item.lat, item.lng))
      );
    }
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
  const latlngs: L.LatLng[] = await OsrmService.getRoadPolyline(busLine.points);
  busLine.setLatLngs(latlngs);
  disableSpinningWheel();
}

export type BusLineType = {
  id?: number;
  schools: SchoolType[];
  name?: string;
  color: Accessor<string>;
  setColor: Setter<string>;
  points: BusLinePointType[];
  latLngs: Accessor<L.LatLng[]>;
  setLatLngs: Setter<L.LatLng[]>;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type BusLinePointType = {
  id: number;
  leafletId: number;
  name: string;
  lon: number;
  lat: number;
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
};

export type BusLinePointDBType = {
  stop_id: number;
  school_id: number;
  quantity: number;
};
