import { RaceDBType, RaceEntity, RaceType } from "../_entities/race.entity";
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

  static async create(line: RaceType): Promise<RaceType> {
    const data = RaceEntity.dbFormat(line);
    // TODO changer endpoint Xano pour /race
    const dbRace: RaceDBType = await ServiceUtils.post("/bus-course", data);
    return RaceEntity.build(dbRace);
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

  static async delete(id: number): Promise<boolean> {
    // TODO changer endpoint Xano pour /race
    return await ServiceUtils.delete("/bus-course/" + id);
  }
}
