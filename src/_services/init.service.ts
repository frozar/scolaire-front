import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
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

export namespace InitService {
  export async function getAll(): Promise<InitType> {
    const dbInit: InitDBType = await ServiceUtils.get("/init");
    console.log("dbInit", dbInit);

    const busLines = dbInit.bus_lines.map((dbLine: LineDBType) =>
      BusLineEntity.build(dbLine)
    );
    const stops = dbInit.stops.map((dbStop: StopDBType) =>
      StopEntity.build(dbStop)
    );
    const schools = dbInit.school.map((dbSchool) =>
      SchoolEntity.build(dbSchool)
    );
    return { schools, stops, busLines };
  }
}
