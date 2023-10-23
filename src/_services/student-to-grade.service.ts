import {
  AssociatedSchoolType,
  AssociatedStopType,
  EntityUtils,
} from "../_entities/_utils.entity";
import {
  SchoolDBType,
  SchoolEntity,
  SchoolType,
} from "../_entities/school.entity";
import {
  DBAssociatedStop,
  StopDBType,
  StopEntity,
  StopType,
} from "../_entities/stop.entity";
import { StudentToGradeEntity } from "../_entities/student-to-grade.entity";
import { ServiceUtils } from "./_utils.service";

export type StudentToGrade = {
  id: number;
  school_name: string;
  stop_name: string;
  class_name: string;
  quantity: number;
};

export class StudentToGradeService {
  static async import(
    students_to_grades: StudentToGrade[]
  ): Promise<{ schools: SchoolType[]; stops: StopType[] }> {
    const xanoResult: { schools: SchoolDBType[]; stops: StopDBType[] } =
      await ServiceUtils.post("/student-to-grade/import", {
        students_to_grades: students_to_grades,
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
    gradeToSchool: Omit<AssociatedStopType, "idClassToSchool">,
    schoolId: number
  ): Promise<AssociatedSchoolType> {
    const dbFormat = StudentToGradeEntity.dbFormat(gradeToSchool, schoolId);
    const response: DBAssociatedStop = await ServiceUtils.post(
      "/student-to-grade",
      dbFormat
    );
    return EntityUtils.formatAssociatedGradeToSchoolForStop([response])[0];
  }

  static async update(
    gradeToSchool: AssociatedStopType,
    schoolId: number
  ): Promise<AssociatedSchoolType> {
    const dbFormat = StudentToGradeEntity.dbFormat(gradeToSchool, schoolId);
    const response: DBAssociatedStop = await ServiceUtils.patch(
      "/student-to-grade/" + gradeToSchool.idClassToSchool,
      dbFormat
    );
    return EntityUtils.formatAssociatedGradeToSchoolForStop([response])[0];
  }

  // Backend will return only the id deleted
  static async delete(id: number): Promise<number> {
    const response = await ServiceUtils.delete("/student-to-grade/" + id);
    return response;
  }
}
