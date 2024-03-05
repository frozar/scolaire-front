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
import { ServiceDBType, ServiceEntity } from "../_entities/service.entity";
import { SettingType } from "../_entities/setting.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { TransporterType } from "../_entities/transporter.entity";
import {
  TripDirectionType,
  setTripDirections,
} from "../_entities/trip-direction.entity";
import { StopStore } from "../_stores/stop.store";
import { setAllTransporter } from "../views/content/allotment/molecule/TransporterTable";
import {
  AllotmentType,
  setAllotment,
} from "../views/content/allotment/organism/Allotment";
import { BusCategoryType, setBus } from "../views/content/bus/organism/Bus";
import { setCalendars } from "../views/content/calendar/calendar.manager";
import { setCalendarsPeriod } from "../views/content/calendar/template/Calendar";
import { setLines } from "../views/content/map/component/organism/BusLines";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setSettings } from "../views/content/parameters/organism/Settings";
import { setServices } from "../views/content/service/organism/Services";
import { ServiceUtils } from "./_utils.service";

type InitDBType = {
  school: SchoolDBType[];
  stops: StopDBType[];
  bus_lines: LineDBType[];
  calendars: CalendarDBType[];
  calendars_periods: CalendarPeriodDBType[];
  trip_directions: TripDirectionType[];
  services: ServiceDBType[];
  bus_categories: BusCategoryType[];
  allotment: AllotmentType[];
  settings: SettingType[];
  transporter: TransporterType[];
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
    StopStore.set(stops);

    const busLines = dbInit.bus_lines.map((dbLine: LineDBType) =>
      BusLineEntity.build(dbLine)
    );
    setLines(busLines);

    const calendars = dbInit.calendars.map((calendar) =>
      CalendarEntity.build(calendar)
    );
    setCalendars(calendars);

    const bus = dbInit.bus_categories;
    setBus(bus);

    const allotment = dbInit.allotment;
    setAllotment(allotment);

    const transporter = dbInit.transporter;
    setAllTransporter(transporter);

    const calendarPeriods = dbInit.calendars_periods.map((calendarPeriod) =>
      CalendarEntity.buildCalendarPeriod(calendarPeriod)
    );
    setCalendarsPeriod(calendarPeriods);

    setTripDirections(dbInit.trip_directions);

    const services = dbInit.services.map((service) =>
      ServiceEntity.build(service)
    );

    setServices(services);

    const settings = dbInit.settings;
    setSettings(settings);

    return { schools, stops, busLines };
  }
}
