import { Accessor, Setter, createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { NatureEnum } from "../type";
import {
  AssociatedDBPointType,
  AssociatedPointType,
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
      associated: EntityUtils.formatAssociatedPoints(dbStop.associated),

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
}

export type StopType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  associated: AssociatedPointType[];
  nature: NatureEnum;

  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type StopDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: AssociatedDBPointType[];
};
