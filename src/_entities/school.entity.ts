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
import {
  CalendarDBType,
  CalendarEntity,
  CalendarType,
} from "./calendar.entity";
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
      calendar: dbSchool.calendar
        ? CalendarEntity.build(dbSchool.calendar)
        : undefined,
      waitingTime: dbSchool.waiting_time,
    };
  }

  static dbFormat(
    school: Pick<
      SchoolType,
      "name" | "lon" | "lat" | "hours" | "calendar" | "waitingTime"
    >
  ): Pick<
    SchoolDBType,
    "name" | "location" | "hours" | "calendar_id" | "waiting_time"
  > {
    return {
      name: school.name,
      location: EntityUtils.builLocationPoint(
        school.lon as number,
        school.lat as number
      ),
      hours: TimeUtils.formatHours(school.hours),
      calendar_id: school?.calendar?.id,
      waiting_time: school.waitingTime,
    };
  }

  // ! unused
  // static dataToDB(
  //   datas: Pick<SchoolType, "name" | "lon" | "lat" | "hours" | "waitingTime">[]
  // ) {
  //   return datas.map((data) => {
  //     return SchoolEntity.dbFormat({
  //       name: data.name,
  //       lat: +data.lat,
  //       lon: +data.lon,
  //       hours: data.hours,
  //       waitingTime: data.waitingTime,
  //     });
  //   });
  // }

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
  calendar?: CalendarType;
  waitingTime: number;
};

export type SchoolDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  grades: GradeDBType[];
  hours_id?: number;
  hours?: HoursDBType;
  calendar_id?: number;
  calendar?: CalendarDBType;
  waiting_time: number;
};

export type LeafletShoolType = SchoolType & {
  idPoint: number;
};
