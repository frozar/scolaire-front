import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { ServiceUtils } from "./_utils.service";

export class StopService {
  static async getAll(): Promise<StopType[]> {
    const dbStops: StopDBType[] = await ServiceUtils.get("/stop");
    return dbStops.map((dbStop: StopDBType) => StopEntity.build(dbStop));
  }

  static async create(
    stop: Omit<StopType, "id" | "selected">
  ): Promise<StopType> {
    const data = StopEntity.dbFormat(stop);
    const dbStop: StopDBType = await ServiceUtils.post("/stop", data);
    return StopEntity.build(dbStop);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/stop/" + id);
  }
}
