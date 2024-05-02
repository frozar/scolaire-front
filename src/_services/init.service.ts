import {
  AllotmentDBType,
  AllotmentEntity,
} from "../_entities/allotment.entity";
import { BusStopDBType } from "../_entities/busStops.entity";
import {
  CalendarDBType,
  CalendarEntity,
  CalendarPeriodDBType,
} from "../_entities/calendar.entity";
import {
  FlatGraphicDBType,
  FlatGraphicEntity,
} from "../_entities/flatGraphic.entity";
import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { PathDBType, PathEntity } from "../_entities/road.entity";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { ServiceDBType, ServiceEntity } from "../_entities/service.entity";
import { SettingType } from "../_entities/setting.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { TransporterEntity } from "../_entities/transporter.entity";
import {
  TripDirectionType,
  setTripDirections,
} from "../_entities/trip-direction.entity";
import { AllotmentStore } from "../_stores/allotment.store";
import { CalendarPeriodStore } from "../_stores/calendar-period.store";
import { CalendarStore } from "../_stores/calendar.store";
import { FlatGraphicStore } from "../_stores/flatGraphics.store";
import { LineStore } from "../_stores/line.store";
import { PathStore } from "../_stores/path.store";
import { SchoolStore } from "../_stores/school.store";
import { ServiceStore } from "../_stores/service.store";
import { StopStore } from "../_stores/stop.store";
import { TransporterStore } from "../_stores/transporter.store";
import { BusCategoryType, setBus } from "../views/content/bus/organism/Bus";
import { setSettings } from "../views/content/parameters/organism/Settings";
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
  allotment: AllotmentDBType[];
  settings: SettingType[];
  transporter: TransporterType[];
  paths: PathDBType[];
  bus_stops: BusStopDBType[];
  flat_graphics: FlatGraphicDBType[];
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

    const allotment = dbInit.allotment.map((allotment) =>
      AllotmentEntity.build(allotment)
    );
    AllotmentStore.set(allotment);

    const transporter = dbInit.transporter.map((transporter) =>
      TransporterEntity.build(transporter)
    );
    TransporterStore.set(transporter);

    const paths = dbInit.paths.map((path) => PathEntity.build(path));
    PathStore.set(paths);

    const calendarPeriods = dbInit.calendars_periods.map((calendarPeriod) =>
      CalendarEntity.buildCalendarPeriod(calendarPeriod)
    );
    CalendarPeriodStore.set(calendarPeriods);

    const services = dbInit.services.map((service) =>
      ServiceEntity.build(service)
    );
    ServiceStore.set(services);

    const settings = dbInit.settings;
    setSettings(settings);

    const FlatGraphics = dbInit.flat_graphics.map((graph) =>
      FlatGraphicEntity.build(graph)
    );
    FlatGraphicStore.set(FlatGraphics);

    return { schools, stops, busLines };
  }
}
