import { Accessor, Setter, createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { NatureEnum } from "../type";
import {
  AssociatedSchoolType,
  EntityUtils,
  LocationDBType,
} from "./_utils.entity";

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
      associated: EntityUtils.formatAssociatedClassToSchoolForStop(
        dbStop.associated_class
      ),

      leafletId: nextLeafletPointId(),
      selected: selected,
      setSelected: setSelected,
    };
  }

  static dbFormat(
    stop: Omit<
      StopType,
      | "id"
      | "selected"
      | "associated_class"
      | "setSelected"
      | "nature"
      | "leafletId"
    >
  ): Omit<StopDBType, "id" | "associated_class"> {
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
  associated: AssociatedSchoolType[];
  nature: NatureEnum;

  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type DBAssociatedStop = {
  id: number; // TODO id of the association v2_student_to_school -> to delete
  stop_id?: number;
  quantity: number;
  class_id: number;
};

export type StopDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated_class: DBAssociatedStop[];
};
