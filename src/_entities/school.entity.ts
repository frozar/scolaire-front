import { Accessor, Setter, createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { NatureEnum } from "../type";
import { QuantityUtils } from "../utils/quantity.utils";
import { getRaces } from "../views/content/map/component/organism/Races";
import {
  AssociatedDBPointType,
  AssociatedPointType,
  EntityUtils,
  LocationDBType,
} from "./_utils.entity";
import { ClasseDBType, ClasseEntity, ClasseType } from "./classe.entity";

const [, { nextLeafletPointId }] = useStateGui();

export class SchoolEntity {
  static build(dbSchool: SchoolDBType): SchoolType {
    const [selected, setSelected] = createSignal<boolean>(false);
    return {
      id: dbSchool.id,
      lon: dbSchool.location.data.lng,
      lat: dbSchool.location.data.lat,
      name: dbSchool.name,
      nature: NatureEnum.school,
      associated: EntityUtils.formatAssociatedClassToSchool(
        dbSchool.associated,
        { id: dbSchool.id, name: dbSchool.name }
      ),
      classes:
        dbSchool.classes != undefined
          ? dbSchool.classes.map((classe) => ClasseEntity.build(classe))
          : [],
      leafletId: nextLeafletPointId(),
      selected: selected,
      setSelected: setSelected,
    };
  }

  static dbFormat(
    school: Pick<SchoolType, "name" | "lon" | "lat">
  ): Pick<SchoolDBType, "name" | "location"> {
    return {
      name: school.name,
      location: EntityUtils.builLocationPoint(school.lon, school.lat),
    };
  }

  static dataToDB(datas: Pick<SchoolType, "name" | "lon" | "lat">[]) {
    return datas.map((data) => {
      return SchoolEntity.dbFormat({
        name: data.name,
        lat: +data.lat,
        lon: +data.lon,
      });
    });
  }

  // TODO à place dans un SchoolUtils
  static getTotalQuantity(school: SchoolType) {
    let quantity = 0;
    for (const stop of school.associated) {
      quantity += stop.quantity;
    }
    return quantity;
  }

  // TODO à place dans un SchoolUtils
  static getRemainingQuantity(school: SchoolType) {
    let quantity = 0;
    for (const stop of school.associated) {
      quantity += QuantityUtils.remaining(stop);
    }
    return quantity;
  }

  // TODO à place dans un SchoolUtils
  static getSchoolRaces(currentSchoolId: number) {
    const lines = [];

    for (const line of getRaces()) {
      const _line = line.schools.filter((l) => l.id == currentSchoolId);
      if (_line.length > 0) lines.push(line);
    }

    return lines;
  }
}

export type SchoolType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  associated: AssociatedPointType[];
  nature: NatureEnum;
  classes: ClasseType[];
  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
};

export type SchoolDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: AssociatedDBPointType[];
  classes: ClasseDBType[];
};

export type LeafletShoolType = SchoolType & {
  idPoint: number;
};
