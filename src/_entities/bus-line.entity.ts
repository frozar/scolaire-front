import L from "leaflet";
import { Accessor, Setter, createSignal } from "solid-js";
import { NatureEnum } from "../type";
import { LeafletPointType } from "../views/content/graphicage/component/atom/Point";
import { getLeafletSchools } from "../views/content/graphicage/component/organism/SchoolPoints";
import { getLeafletStops } from "../views/content/graphicage/component/organism/StopPoints";
import { SchoolType } from "./school.entity";

export class BusLineEntity {
  static build(dbData: BusLineDBType): BusLineType {
    const filteredShools: LeafletPointType[] = getLeafletSchools().filter(
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
    const [selected, setSelected] = createSignal(false);
    const [polyline, setPolyline] = createSignal([]);

    return {
      id: dbData.id,
      school: school,
      name: dbData.name,
      color: "#" + dbData.color,
      points: formatBusLinePointType(dbData.bus_line_stop),
      polyline: polyline,
      setPolyline: setPolyline,
      selected: selected,
      setSelected: setSelected,
    };
  }
}

const formatBusLinePointType = (
  points: BusLinePointDBType[]
): BusLinePointType[] => {
  return points.map((dbPoint) => {
    const associatedPoint: LeafletPointType =
      getAssociatedBusLinePoint(dbPoint);
    if (!associatedPoint) {
      //TODO Error log to improve
      console.log(
        "Error : impossible de retrouver le point de la ligne de bus "
      );
    }
    return {
      id: associatedPoint.id,
      name: associatedPoint.name,
      lon: associatedPoint.lon,
      lat: associatedPoint.lat,
      nature: associatedPoint.nature,
      quantity: dbPoint.quantity,
    };
  });
};

const getAssociatedBusLinePoint = (
  dbPoint: BusLinePointDBType
): LeafletPointType => {
  if (dbPoint.school_id != 0) {
    return getLeafletSchools().filter(
      (item) => item.id == dbPoint.school_id
    )[0];
  }
  return getLeafletStops().filter((item) => item.id == dbPoint.stop_id)[0];
};

export type BusLineType = {
  id: number;
  name: string;
  color: string;
  school: SchoolType;
  points: BusLinePointType[];
  polyline: Accessor<L.LatLng[]>;
  setPolyline: Setter<L.LatLng[]>;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type BusLinePointType = {
  id: number;
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
};

export type BusLinePointDBType = {
  stop_id: number;
  school_id: number;
  quantity: number;
};
