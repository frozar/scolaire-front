import {
  CalendarDBType,
  CalendarEntity,
  CalendarPeriodDBType,
} from "../_entities/calendar.entity";
import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import {
  TripDirectionType,
  setTripDirections,
} from "../_entities/trip-direction.entity";
import {
  setCalendars,
  setCalendarsPeriod,
} from "../views/content/calendar/template/Calendar";
import { setLines } from "../views/content/map/component/organism/BusLines";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
import { ServiceUtils } from "./_utils.service";

type InitDBType = {
  school: SchoolDBType[];
  stops: StopDBType[];
  bus_lines: LineDBType[];
};

export type InitType = {
  schools: SchoolType[];
  stops: StopType[];
  busLines: LineType[];
};

export type InitDBCalendarType = {
  calendars: CalendarDBType[];
  calendars_period: CalendarPeriodDBType[];
  trips_direction: TripDirectionType[];
};

export namespace InitService {
  export async function getAll(): Promise<InitType> {
    const dbInit: InitDBType = await ServiceUtils.get("/init");

    const schools = dbInit.school.map((dbSchool) =>
      SchoolEntity.build(dbSchool)
    );
    setSchools(schools);

    const stops = dbInit.stops.map((dbStop: StopDBType) =>
      StopEntity.build(dbStop)
    );
    setStops(stops);

    const busLines = dbInit.bus_lines.map((dbLine: LineDBType) =>
      BusLineEntity.build(dbLine)
    );

    setLines(busLines);

    InitService.loadCalendars();

    return { schools, stops, busLines };
  }

  export async function loadCalendars(): Promise<void> {
    const dbInit: InitDBCalendarType = await ServiceUtils.get("/calendars");

    setCalendars(
      dbInit.calendars.map((calendar) => CalendarEntity.build(calendar))
    );

    setCalendarsPeriod(
      dbInit.calendars_period.map((calendarPeriod) =>
        CalendarEntity.buildCalendarPeriod(calendarPeriod)
      )
    );

    setTripDirections(dbInit.trips_direction);
  }
}
