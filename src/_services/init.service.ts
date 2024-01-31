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
import { setCalendars } from "../views/content/calendar/calendar.manager";
import { setCalendarsPeriod } from "../views/content/calendar/template/Calendar";
import { setLines } from "../views/content/map/component/organism/BusLines";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
import { ServiceUtils } from "./_utils.service";

type InitDBType = {
  school: SchoolDBType[];
  stops: StopDBType[];
  bus_lines: LineDBType[];
  calendars: CalendarDBType[];
  calendars_periods: CalendarPeriodDBType[];
  trip_directions: TripDirectionType[];
};

export type InitType = {
  schools: SchoolType[];
  stops: StopType[];
  busLines: LineType[];
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

    const calendars = dbInit.calendars.map((calendar) =>
      CalendarEntity.build(calendar)
    );
    setCalendars(calendars);

    const calendarPeriods = dbInit.calendars_periods.map((calendarPeriod) =>
      CalendarEntity.buildCalendarPeriod(calendarPeriod)
    );
    setCalendarsPeriod(calendarPeriods);

    setTripDirections(dbInit.trip_directions);

    return { schools, stops, busLines };
  }
}
