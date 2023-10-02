import {
  BusCourseDBType,
  BusCourseEntity,
  BusCourseType,
} from "../_entities/bus-course.entity";
import { ServiceUtils } from "./_utils.service";

export class BusCourseService {
  static async getAll(): Promise<BusCourseType[]> {
    const dbStops: BusCourseDBType[] = await ServiceUtils.get("/bus-course");
    return dbStops
      ? dbStops.map((dbStop: BusCourseDBType) => BusCourseEntity.build(dbStop))
      : [];
  }

  static async create(line: BusCourseType): Promise<BusCourseType> {
    const data = BusCourseEntity.dbFormat(line);
    const dbBusCourse: BusCourseDBType = await ServiceUtils.post(
      "/bus-course",
      data
    );
    return BusCourseEntity.build(dbBusCourse);
  }

  static async update(line: Partial<BusCourseType>): Promise<BusCourseType> {
    const data = BusCourseEntity.dbPartialFormat(line);
    const dbBusCourse: BusCourseDBType = await ServiceUtils.patch(
      "/bus-course/" + line.id,
      data
    );
    if (dbBusCourse == null) return dbBusCourse;
    return BusCourseEntity.build(dbBusCourse);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/bus-course/" + id);
  }
}
