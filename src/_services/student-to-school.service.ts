import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import {
  ClassStudentToSchool,
  ClassStudentToSchoolDBType,
} from "../_entities/student-to-school.entity";
import { ServiceUtils } from "./_utils.service";

export type StudentToSchool = {
  id: number;
  school_name: string;
  stop_name: string;
  class_name: string;
  quantity: number;
};

export class StudentToSchoolService {
  static async import(
    students_to_schools: StudentToSchool[]
  ): Promise<{ schools: SchoolType[]; stops: StopType[] }> {
    const xanoResult: { schools: SchoolDBType[]; stops: StopDBType[] } =
      await ServiceUtils.post("/student-to-school/import", {
        students_to_schools: students_to_schools,
      });

    const new_schools = xanoResult.schools.map((dbSchool) =>
      SchoolEntity.build(dbSchool)
    );

    const new_stops = xanoResult.stops.map((dbStop) =>
      StopEntity.build(dbStop)
    );

    return { schools: new_schools, stops: new_stops };
  }

  static async create(
    props: Omit<ClassStudentToSchoolDBType, "id">
  ): Promise<StudentToSchool> {
    const response = await ServiceUtils.post("/student-to-school", props);
    return ClassStudentToSchool.build(response);
  }
}
