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
import { ClassStudentToSchoolEntity } from "../_entities/student-to-school.entity";
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
    classToSchool: Omit<AssociatedStopType, "idClassToSchool">,
    schoolId: number
  ): Promise<AssociatedSchoolType> {
    const dbFormat = ClassStudentToSchoolEntity.dbFormat(
      classToSchool,
      schoolId
    );
    const response: DBAssociatedStop = await ServiceUtils.post(
      "/student-to-school",
      dbFormat
    );
    return EntityUtils.formatAssociatedClassToSchoolForStop([response])[0];
  }

  static async update(
    classToSchool: AssociatedStopType,
    schoolId: number
  ): Promise<AssociatedSchoolType> {
    const dbFormat = ClassStudentToSchoolEntity.dbFormat(
      classToSchool,
      schoolId
    );
    const response: DBAssociatedStop = await ServiceUtils.patch(
      "/student-to-school/" + classToSchool.idClassToSchool + "/v2",
      dbFormat
    );
    return EntityUtils.formatAssociatedClassToSchoolForStop([response])[0];
  }

  // Backend will return only the id deleted
  static async delete(id: number): Promise<number> {
    const response = await ServiceUtils.delete(
      "/student-to-school/" + id + "/v2"
    );
    return response;
  }
}
