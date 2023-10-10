import {
  BusCourseEntity,
  CourseDBType,
  CourseType,
} from "../_entities/course.entity";
import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export class BusCourseService {
  static async getAll(): Promise<CourseType[]> {
    const dbStops: CourseDBType[] = await ServiceUtils.get("/bus-course");
    return dbStops
      ? dbStops.map((dbStop: CourseDBType) => BusCourseEntity.build(dbStop))
      : [];
  }

  static async create(line: CourseType): Promise<LineType[]> {
    const data = BusCourseEntity.dbFormat(line);

    const dbBusCourse: { bus_lines: LineDBType[] } = await ServiceUtils.post(
      "/busline/" + getSelectedLine()?.id + "/bus-course_v2", //TODO tester la v2
      data
    );

    const bus_lines = dbBusCourse.bus_lines;

    return bus_lines
      ? bus_lines.map((dbLine: LineDBType) => BusLineEntity.build(dbLine))
      : [];
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
