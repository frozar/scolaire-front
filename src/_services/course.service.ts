import {
  BusCourseEntity,
  CourseDBType,
  CourseType,
} from "../_entities/course.entity";
import { ServiceUtils } from "./_utils.service";

export class BusCourseService {
  static async getAll(): Promise<CourseType[]> {
    const dbStops: CourseDBType[] = await ServiceUtils.get("/bus-course");
    return dbStops
      ? dbStops.map((dbStop: CourseDBType) => BusCourseEntity.build(dbStop))
      : [];
  }

  static async create(line: CourseType): Promise<CourseType> {
    const data = BusCourseEntity.dbFormat(line);
    const dbBusCourse: CourseDBType = await ServiceUtils.post(
      "/bus-course",
      data
    );
    return BusCourseEntity.build(dbBusCourse);
  }

  static async update(line: Partial<CourseType>): Promise<CourseType> {
    const data = BusCourseEntity.dbPartialFormat(line);
    const dbBusCourse: CourseDBType = await ServiceUtils.patch(
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
