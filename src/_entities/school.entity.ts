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
      hours: this.buildHours(dbSchool.hours),
    };
  }

  static dbFormat(school: Partial<SchoolType>): Partial<SchoolDBType> {
    return {
      name: school.name,
      location: EntityUtils.builLocationPoint(
        school.lon as number,
        school.lat as number
      ),
      hours: SchoolEntity.formatHours(school.hours),
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
  static getSchoolTrips(currentSchoolId: number) {
    const lines = [];

    for (const line of getTrips()) {
      const _line = line.schools.filter((l) => l.id == currentSchoolId);
      if (_line.length > 0) lines.push(line);
    }

    return lines;
  }

  static buildHours(hours: HoursDBType | undefined): HoursType {
    if (!hours) {
      return {
        id: 0,
        startHourGoing: {
          hour: 7,
          minutes: 0,
        },
        startHourComing: {
          hour: 7,
          minutes: 30,
        },
        endHourComing: {
          hour: 7,
          minutes: 0,
        },
        endHourGoing: {
          hour: 7,
          minutes: 30,
        },
      };
    }
    return {
      id: hours.id,
      startHourComing: GradeEntity.getHourFormatFromString(
        hours.start_hour_coming
      ),
      startHourGoing: GradeEntity.getHourFormatFromString(
        hours.start_hour_going
      ),
      endHourComing: GradeEntity.getHourFormatFromString(hours.end_hour_coming),
      endHourGoing: GradeEntity.getHourFormatFromString(hours.end_hour_going),
    };
  }

  static formatHours(hours: HoursType | undefined): HoursDBType {
    if (!hours) {
      return {
        id: 0,
        start_hour_coming: "7:0",
        end_hour_coming: "7:30",
        start_hour_going: "16:0",
        end_hour_going: "16:30",
      };
    }
    return {
      id: hours.id,
      start_hour_coming: GradeEntity.getStringFromHourFormat(
        hours.startHourComing
      ),
      end_hour_coming: GradeEntity.getStringFromHourFormat(hours.endHourComing),
      start_hour_going: GradeEntity.getStringFromHourFormat(
        hours.startHourGoing
      ),
      end_hour_going: GradeEntity.getStringFromHourFormat(hours.endHourGoing),
    };
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
