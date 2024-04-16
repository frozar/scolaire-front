import { BusStopDBType } from "../_entities/busStops.entity";
import {
  CalendarDBType,
  CalendarEntity,
  CalendarPeriodDBType,
} from "../_entities/calendar.entity";
import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { RoadDBType, RoadEntity } from "../_entities/road.entity";
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
import { CalendarPeriodStore } from "../_stores/calendar-period.store";
import { CalendarStore } from "../_stores/calendar.store";
import { LineStore } from "../_stores/line.store";
import { SchoolStore } from "../_stores/school.store";
import { StopStore } from "../_stores/stop.store";
import { setAllTransporter } from "../views/content/allotment/molecule/TransporterTable";
import {
  AllotmentType,
  setAllotment,
} from "../views/content/allotment/organism/Allotment";
import { BusCategoryType, setBus } from "../views/content/bus/organism/Bus";
import { setSettings } from "../views/content/parameters/organism/Settings";
import { setRoads } from "../views/content/paths/template/Paths";
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
  roads: RoadDBType[];
  bus_stops: BusStopDBType[];
};

export type InitType = {
  schools: SchoolType[];
  stops: StopType[];
  busLines: LineType[];
};

export namespace InitService {
  export async function getAll(): Promise<InitType> {
    const dbInit: InitDBType = await ServiceUtils.get("/init");

    setTripDirections(dbInit.trip_directions);

    const schools = dbInit.school.map((dbSchool) =>
      SchoolEntity.build(dbSchool)
    );
    SchoolStore.set(schools);

    const stops = dbInit.stops.map((dbStop: StopDBType) =>
      StopEntity.build(dbStop)
    );
    StopStore.set(stops);

    const busLines = dbInit.bus_lines.map((dbLine: LineDBType) =>
      BusLineEntity.build(dbLine)
    );
    LineStore.set(busLines);

    const calendars = dbInit.calendars.map((calendar) =>
      CalendarEntity.build(calendar)
    );
    CalendarStore.set(calendars);

    const bus = dbInit.bus_categories;
    setBus(bus);

    const allotment = dbInit.allotment;
    setAllotment(allotment);

    const transporter = dbInit.transporter;
    setAllTransporter(transporter);

    const roaads = dbInit.roads.map((road) => RoadEntity.build(road));
    setRoads(roaads);

    const calendarPeriods = dbInit.calendars_periods.map((calendarPeriod) =>
      CalendarEntity.buildCalendarPeriod(calendarPeriod)
    );
    CalendarPeriodStore.set(calendarPeriods);

    const services = dbInit.services.map((service) =>
      ServiceEntity.build(service)
    );

    setServices(services);

    const settings = dbInit.settings;
    setSettings(settings);

    return { schools, stops, busLines };
  }
}
