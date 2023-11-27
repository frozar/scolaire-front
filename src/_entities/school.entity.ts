import { Accessor, Setter, createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { NatureEnum } from "../type";
import { getTrips } from "../views/content/map/component/organism/Trips";
import {
  AssociatedStopType,
  EntityUtils,
  HoursDBType,
  HoursType,
  LocationDBType,
} from "./_utils.entity";
import { GradeDBType, GradeEntity, GradeType } from "./grade.entity";
import { DBAssociatedStop } from "./stop.entity";
import { TimeUtils } from "./time.utils";

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
      //TODO Delete associated
      associated: dbSchool.grades
        .map((grade) =>
          EntityUtils.formatAssociatedClassToSchoolForSchool(
            grade.associated as DBAssociatedStop[],
            grade.id
          )
        )
        .flat(),
      grades:
        dbSchool.grades != undefined
          ? dbSchool.grades.map((grade) => GradeEntity.build(grade))
          : [],
      leafletId: nextLeafletPointId(),
      selected: selected,
      setSelected: setSelected,
      hours: TimeUtils.buildHours(dbSchool.hours),
    };
  }

  static dbFormat(
    school: Pick<SchoolType, "name" | "lon" | "lat" | "hours">
  ): Pick<SchoolDBType, "name" | "location" | "hours"> {
    return {
      name: school.name,
      location: EntityUtils.builLocationPoint(
        school.lon as number,
        school.lat as number
      ),
      hours: TimeUtils.formatHours(school.hours),
    };
  }

  static dataToDB(datas: Pick<SchoolType, "name" | "lon" | "lat" | "hours">[]) {
    return datas.map((data) => {
      return SchoolEntity.dbFormat({
        name: data.name,
        lat: +data.lat,
        lon: +data.lon,
        hours: data.hours,
      });
    });
  }

  // TODO à place dans un SchoolUtils
  static getSchoolTrips(currentSchoolId: number) {
    const lines = [];

    for (const line of getTrips()) {
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
  associated: AssociatedStopType[];
  nature: NatureEnum;
  grades: GradeType[];
  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  hours: HoursType;
};

export type SchoolDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  grades: GradeDBType[];
  hours_id?: number;
  hours?: HoursDBType;
};

export type LeafletShoolType = SchoolType & {
  idPoint: number;
};

export type importSchoolsDBType = {
  schools_to_add: Pick<SchoolDBType, "name" | "location">[];
  schools_to_modify: Pick<SchoolDBType, "id" | "location">[];
  schools_to_delete: number[];
};
