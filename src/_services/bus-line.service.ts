import {
  CourseDBType,
  CourseEntity,
  CourseType,
} from "../_entities/course.entity";
import { ServiceUtils } from "./_utils.service";

export class CourseService {
  static async getAll(): Promise<CourseType[]> {
    const dbStops: CourseDBType[] = await ServiceUtils.get("/course");
    return dbStops
      ? dbStops.map((dbStop: CourseDBType) => CourseEntity.build(dbStop))
      : [];
  }

  static async create(line: CourseType): Promise<CourseType> {
    const data = CourseEntity.dbFormat(line);
    const dbCourse: CourseDBType = await ServiceUtils.post("/course", data);
    return CourseEntity.build(dbCourse);
  }

  static async update(line: Partial<CourseType>): Promise<CourseType> {
    const data = CourseEntity.dbPartialFormat(line);
    const dbCourse: CourseDBType = await ServiceUtils.patch(
      "/course/" + line.id,
      data
    );
    if (dbCourse == null) return dbCourse;
    return CourseEntity.build(dbCourse);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/course/" + id);
  }
}
