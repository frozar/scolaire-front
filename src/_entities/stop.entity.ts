import { Accessor, Setter, createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { NatureEnum } from "../type";
import { EntityUtils, LocationDBType } from "./_utils.entity";
import { ClassToSchoolTypeFormatedWithUsedQuantity } from "./student-to-school.entity";

const [, { nextLeafletPointId }] = useStateGui();

export class StopEntity {
  static build(dbStop: StopDBType): StopType {
    const [selected, setSelected] = createSignal<boolean>(false);
    return {
      id: dbStop.id,
      lon: dbStop.location.data.lng,
      lat: dbStop.location.data.lat,
      name: dbStop.name,
      nature: NatureEnum.stop,
      associated: EntityUtils.formatAssociatedClassToSchool(dbStop.associated),

      leafletId: nextLeafletPointId(),
      selected: selected,
      setSelected: setSelected,
    };
  }

  static dbFormat(
    stop: Omit<
      StopType,
      "id" | "selected" | "associated" | "setSelected" | "nature" | "leafletId"
    >
  ): Omit<StopDBType, "id" | "associated"> {
    return {
      name: stop.name,
      location: EntityUtils.builLocationPoint(stop.lon, stop.lat),
    };
  }

  static dataToDB(datas: Pick<StopType, "name" | "lon" | "lat">[]) {
    return datas.map((data) => {
      return StopEntity.dbFormat({
        name: data.name,
        lat: +data.lat,
        lon: +data.lon,
      });
    });
  }
}

export type StopType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  // TODO lucas doit être associatedPointType
  associated: ClassToSchoolTypeFormatedWithUsedQuantity[];
  nature: NatureEnum;

  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type StopDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: ClassToSchoolTypeFormatedWithUsedQuantity[];
};
