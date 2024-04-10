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
import { BusStopDBType, BusStopEntity, BusStopType } from "./busStops.entity";
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
    console.log(dbSchool);
    return {
      id: dbSchool.id,
      lon: dbSchool.location.data.lng,
      lat: dbSchool.location.data.lat,
      name: dbSchool.name,
      nature: NatureEnum.school,
      //TODO Delete associated
      associated:
        dbSchool.grades != undefined
          ? dbSchool.grades
              .map((grade) =>
                EntityUtils.formatAssociatedClassToSchoolForSchool(
                  grade.associated as DBAssociatedStop[],
                  grade.id
                )
              )
              .flat()
          : [],
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
      busStops: dbSchool.bus_stops
        ? dbSchool.bus_stops.map(
            (busStop) => BusStopEntity.build(busStop) as BusStopType
          )
        : [],
    };
  }

  static dbFormat(
    school: Pick<
      SchoolType,
      "name" | "lon" | "lat" | "hours" | "calendar" | "waitingTime" | "busStops"
    >
  ): Pick<
    SchoolDBType,
    "name" | "location" | "hours" | "calendar_id" | "waiting_time" | "bus_stops"
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
      // bus_stops: school.busStops.map((busStop) =>
      //   BusStopEntity.DbFormat(busStop)
      // ),
      bus_stops: [],
    };
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
  calendar?: CalendarType;
  waitingTime: number;
  busStops: BusStopType[];
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
  bus_stops: BusStopDBType[];
};

export type LeafletShoolType = SchoolType & {
  idPoint: number;
};
