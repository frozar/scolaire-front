import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
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

export namespace InitService {
  export async function getAll(): Promise<InitType> {
    const dbInit: InitDBType = await ServiceUtils.get("/init");

    const schools = dbInit.school.map((dbSchool) =>
      SchoolEntity.build(dbSchool)
    );
    // console.log("dbInit.school", dbInit.school);
    // console.log("init schools => ", schools);

    setSchools(schools);

    const stops = dbInit.stops.map((dbStop: StopDBType) =>
      StopEntity.build(dbStop)
    );
    console.log("dbInit.stop", dbInit.stops);
    console.log("init stops => ", stops);

    setStops(stops);

    const busLines = dbInit.bus_lines.map((dbLine: LineDBType) =>
      BusLineEntity.build(dbLine)
    );
    // console.log("dbInit.lines => ", dbInit.bus_lines);
    // console.log("init lines => ", busLines);
    setLines(busLines);

    // const tripPoints = busLines
    //   .map((busline) => busline.trips)
    //   .flat()
    //   .map((trip) => trip.points)
    //   .flat();
    // setStops((prev) => {
    //   for (const stop of prev) {
    //     const tripPoint = tripPoints.find((tripPoint) => tripPoint.id == stop.id)
    //     if (tripPoint) {

    //     }

    //   }
    // })

    return { schools, stops, busLines };
  }
}
