import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import {
  ClassStudentToSchoolDBType,
  ClassStudentToSchoolTypeFormated,
} from "../_entities/student-to-school.entity";
import { ServiceUtils } from "./_utils.service";

export class StudentToSchoolService {
  static async import(
    students_to_schools: ClassStudentToSchoolTypeFormated[]
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
  ): Promise<ClassStudentToSchoolTypeFormated> {
    const response: ClassStudentToSchoolTypeFormated = await ServiceUtils.post(
      "/student-to-school",
      props
    );
    return response;
  }

  static async update(
    ClassStudentToSchool: ClassStudentToSchoolDBType
  ): Promise<ClassStudentToSchoolTypeFormated> {
    const response: ClassStudentToSchoolTypeFormated = await ServiceUtils.patch(
      "/student-to-school/" + ClassStudentToSchool.id,
      ClassStudentToSchool
    );
    return response;
  }

  static async delete(id: number): Promise<number> {
    const response = await ServiceUtils.delete("/student-to-school/" + id);
    return response;
  }
}
