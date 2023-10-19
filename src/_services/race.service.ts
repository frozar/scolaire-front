import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { RaceDBType, RaceEntity, RaceType } from "../_entities/race.entity";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export class RaceService {
  static async getAll(): Promise<RaceType[]> {
    // TODO changer endpoint Xano pour /race
    const dbStops: RaceDBType[] = await ServiceUtils.get("/bus-course");
    console.log("dbStops", dbStops);
    return dbStops
      ? dbStops.map((dbStop: RaceDBType) => RaceEntity.build(dbStop))
      : [];
  }

  static async create(
    line: RaceType
  ): Promise<{ newRace: RaceType; busLines: LineType[] }> {
    const data = RaceEntity.dbFormat(line);

    const dbBusRace: {
      bus_lines: { bus_lines: LineDBType[] };
      new_race: RaceDBType;
    } = await ServiceUtils.post(
      "/busline/" + getSelectedLine()?.id + "/bus-course_v2", //TODO tester la v2
      data
    );
    console.log("dbBusRace", dbBusRace);

    const bus_lines = dbBusRace.bus_lines.bus_lines;

    return {
      newRace: RaceEntity.build(dbBusRace.new_race),
      busLines: bus_lines
        ? bus_lines.map((dbLine: LineDBType) => BusLineEntity.build(dbLine))
        : [],
    };
  }

  static async update(line: Partial<RaceType>): Promise<RaceType> {
    const data = RaceEntity.dbPartialFormat(line);
    // TODO changer endpoint Xano pour /race
    const dbRace: RaceDBType = await ServiceUtils.patch(
      "/bus-course/" + line.id,
      data
    );
    if (dbRace == null) return dbRace;
    return RaceEntity.build(dbRace);
  }

  static async delete(id: number): Promise<number> {
    // TODO changer endpoint Xano pour /race
    return await ServiceUtils.delete(
      "/busline/" + getSelectedLine()?.id + "/course/" + id
    );
  }
}
