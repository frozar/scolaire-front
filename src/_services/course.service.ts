import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { RaceDBType, RaceEntity, RaceType } from "../_entities/race.entity";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export class BusRaceService {
  static async getAll(): Promise<RaceType[]> {
    const dbStops: RaceDBType[] = await ServiceUtils.get("/bus-course");
    return dbStops
      ? dbStops.map((dbStop: RaceDBType) => RaceEntity.build(dbStop))
      : [];
  }

  static async create(line: RaceType): Promise<LineType[]> {
    const data = RaceEntity.dbFormat(line);

    const dbBusRace: { bus_lines: LineDBType[] } = await ServiceUtils.post(
      "/busline/" + getSelectedLine()?.id + "/bus-course_v2", //TODO tester la v2
      data
    );

    const bus_lines = dbBusRace.bus_lines;

    return bus_lines
      ? bus_lines.map((dbLine: LineDBType) => BusLineEntity.build(dbLine))
      : [];
  }

  static async update(line: Partial<RaceType>): Promise<RaceType> {
    const data = RaceEntity.dbPartialFormat(line);
    const dbBusRace: RaceDBType = await ServiceUtils.patch(
      "/bus-course/" + line.id,
      data
    );
    if (dbBusRace == null) return dbBusRace;
    return RaceEntity.build(dbBusRace);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/bus-course/" + id);
  }
}
